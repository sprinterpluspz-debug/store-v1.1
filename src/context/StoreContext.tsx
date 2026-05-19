import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, User, Vehicle } from '../types';
import { VEHICLE_DATA } from '../data/vehicles';
import { Language, translations, getLocalized } from '../translations';
import { auth, db } from '../lib/firebase';
import { 
  onAuthStateChanged, 
  signOut, 
  GoogleAuthProvider, 
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification 
} from 'firebase/auth';
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  addDoc, 
  query, 
  where,
  getDoc,
  serverTimestamp
} from 'firebase/firestore';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface StoreContextType {
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  user: User | null;
  loading: boolean;
  selectedVehicle: Vehicle | null;
  setSelectedVehicle: (vehicle: Vehicle | null) => void;
  vehicles: Vehicle[];
  addVehicle: (vehicle: Vehicle) => void;
  updateVehicle: (vehicle: Vehicle) => void;
  deleteVehicle: (vehicleId: string) => void;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateCartQty: (productId: number, delta: number) => void;
  clearCart: () => void;
  placeOrder: (orderDetails: any) => Promise<void>;
  login: () => Promise<void>;
  loginEmail: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  resendVerification: () => Promise<void>;
  checkVerificationStatus: () => Promise<void>;
  users: User[];
  deleteUser: (userId: string) => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (productId: string | number) => Promise<void>;
  deleteOrder: (orderId: string | number) => Promise<void>;
  toggleOrderStatus: (order: Order) => Promise<void>;
  updateUser: (user: User) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  getLocalized: (value: any) => string;
  isFirstDay: boolean;
  recentlyViewed: Product[];
  addToRecentlyViewed: (product: Product) => void;
  getEffectivePrice: (product: Product, quantity: number) => number;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(() => {
    const saved = localStorage.getItem('selected_vehicle');
    return saved ? JSON.parse(saved) : null;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('lang');
    return (saved as Language) || 'en';
  });

  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>(() => {
    const saved = localStorage.getItem('recently_viewed');
    return saved ? JSON.parse(saved) : [];
  });

  // Auth Listener
  const syncProfile = async (firebaseUser: any) => {
    if (!firebaseUser) {
      setUser(null);
      setLoading(false);
      return;
    }
    const isAdminEmail = firebaseUser.email === 'kenotube9816@gmail.com';
    
    try {
      // Sync user profile from Firestore
      const userDoc = doc(db, 'users', firebaseUser.uid);
      const snap = await getDoc(userDoc);
      
      const baseProfile = {
        email: firebaseUser.email || '',
        name: firebaseUser.displayName || 'User',
        role: (isAdminEmail ? 'admin' : 'customer') as 'admin' | 'customer',
        emailVerified: firebaseUser.emailVerified
      };

      if (snap.exists()) {
        const profile = snap.data();
        setUser({
          ...baseProfile,
          name: profile.name || baseProfile.name,
          role: profile.role || baseProfile.role,
          phone: profile.phone,
          address: profile.address,
          emailVerified: firebaseUser.emailVerified,
          created: profile.created
        });
      } else {
        // Create initial profile
        const newProfile = { ...baseProfile, created: serverTimestamp() };
        await setDoc(userDoc, newProfile);
        setUser(newProfile as any);
      }
    } catch (error) {
      console.error("Error syncing user profile:", error);
      // Fallback to basic info from auth
      setUser({
        email: firebaseUser.email || '',
        name: firebaseUser.displayName || 'User',
        role: isAdminEmail ? 'admin' : 'customer',
        emailVerified: firebaseUser.emailVerified
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, syncProfile);
    return () => unsubscribe();
  }, []);

  // Products Listener
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
      const prods = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as unknown as Product));
      setProducts(prods);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'products'));
    return () => unsubscribe();
  }, []);

  // Vehicles Listener
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'vehicles'), (snapshot) => {
      const vehs = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as unknown as Vehicle));
      setVehicles(vehs);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'vehicles'));
    return () => unsubscribe();
  }, []);

  // Orders Listener (Admin sees all, User sees only theirs)
  useEffect(() => {
    if (!auth.currentUser) {
      setOrders([]);
      return;
    }

    const isAdmin = user?.role === 'admin';
    const ordersRef = collection(db, 'orders');
    const q = isAdmin ? ordersRef : query(ordersRef, where('userId', '==', auth.currentUser.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ords = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as unknown as Order));
      setOrders(ords.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'orders'));
    return () => unsubscribe();
  }, [user]);

  // Users List Listener (Admin only)
  useEffect(() => {
    if (user?.role !== 'admin') {
      setUsers([]);
      return;
    }

    const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      const ulist = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as unknown as User));
      setUsers(ulist);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'users'));
    return () => unsubscribe();
  }, [user]);

  useEffect(() => localStorage.setItem('cart', JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem('lang', language), [language]);
  useEffect(() => localStorage.setItem('selected_vehicle', JSON.stringify(selectedVehicle)), [selectedVehicle]);
  useEffect(() => localStorage.setItem('recently_viewed', JSON.stringify(recentlyViewed)), [recentlyViewed]);

  const t = (key: string) => translations[key]?.[language] || key;

  const getEffectivePrice = (product: Product, quantity: number) => {
    let price = product.price;
    const discountRate = isFirstDay ? 0.15 : 0;
    price = price * (1 - discountRate);

    if (quantity >= 50) return price * 0.7;
    if (quantity >= 20) return price * 0.8;
    if (quantity >= 5) return price * 0.85;
    return price;
  };

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      const newQty = existing ? existing.qty + quantity : quantity;
      const unitPrice = getEffectivePrice(product, newQty);
      
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, qty: newQty, price: unitPrice } : item);
      }
      return [...prev, { ...product, qty: quantity, price: unitPrice }];
    });
  };

  const removeFromCart = (productId: number | string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateCartQty = (productId: number | string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const newQty = Math.max(1, item.qty + delta);
        const originalProduct = products.find(p => p.id === productId) || item;
        const unitPrice = getEffectivePrice(originalProduct, newQty);
        return { ...item, qty: newQty, price: unitPrice };
      }
      return item;
    }));
  };

  const clearCart = () => setCart([]);

  const addToRecentlyViewed = (product: Product) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(p => p.id !== product.id);
      return [product, ...filtered].slice(0, 5);
    });
  };

  const sendEmailNotification = async (data: { to: string; subject: string; text?: string; html?: string }) => {
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const err = await response.json();
        console.warn('Email send warning:', err.error);
      }
    } catch (error) {
      console.warn('Failed to send email notification:', error);
    }
  };

  const placeOrder = async (details: any) => {
    if (!auth.currentUser) return;
    try {
      const processedItems = cart.map(item => ({
        ...item,
        isEUOrder: !item.instock || item.quantity <= 0
      }));

      const orderData = {
        ...details,
        userId: auth.currentUser.uid,
        items: processedItems,
        created: serverTimestamp(),
        status: 'new',
        subtotal: cart.reduce((sum, item) => sum + (item.price * item.qty), 0),
        hasEUItems: processedItems.some(i => i.isEUOrder)
      };
      const docRef = await addDoc(collection(db, 'orders'), orderData);
      
      const itemsHtml = processedItems.map(item => `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-size: 14px;">${getLocalized(item.name, language)}</td>
          <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: center; font-size: 14px;">${item.qty}</td>
          <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: right; font-size: 14px;">€${item.price.toFixed(2)}</td>
        </tr>
      `).join('');

      const invoiceHtml = `
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="background: #f9fafb;">
              <th style="padding: 10px; text-align: left; border-bottom: 2px solid #e5e7eb; font-size: 12px; text-transform: uppercase; color: #6b7280;">Product</th>
              <th style="padding: 10px; text-align: center; border-bottom: 2px solid #e5e7eb; font-size: 12px; text-transform: uppercase; color: #6b7280;">Qty</th>
              <th style="padding: 10px; text-align: right; border-bottom: 2px solid #e5e7eb; font-size: 12px; text-transform: uppercase; color: #6b7280;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
      `;

      // Send Order Confirmation Email
      if (auth.currentUser.email) {
        sendEmailNotification({
          to: auth.currentUser.email,
          subject: `Order Confirmation #${docRef.id.slice(0, 8).toUpperCase()}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1f2937;">
              <div style="background: #0ea5e9; padding: 30px; border-radius: 20px 20px 0 0; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 24px;">Order Confirmed!</h1>
              </div>
              <div style="padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 20px 20px; background: white;">
                <p>Hello <strong>${user?.name}</strong>,</p>
                <p>Thank you for your order. We are processing it and will notify you soon.</p>
                
                <h3 style="margin-top: 30px; font-size: 16px; text-transform: uppercase; letter-spacing: 0.1em; color: #9ca3af;">Invoice Summary</h3>
                ${invoiceHtml}

                <div style="background: #f8fafc; padding: 20px; border-radius: 15px; margin-top: 20px;">
                  <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <span style="color: #64748b;">Order ID:</span>
                    <span style="font-family: monospace; font-weight: bold;">${docRef.id}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; margin-bottom: 10px; border-top: 1px solid #e2e8f0; pt: 10px;">
                    <span style="font-weight: bold; font-size: 18px;">Total Paid:</span>
                    <span style="font-weight: bold; font-size: 18px; color: #0ea5e9;">€${orderData.subtotal.toFixed(2)}</span>
                  </div>
                </div>

                <p style="margin-top: 30px; color: #64748b; font-size: 14px;">
                  If you have any questions, please contact our support team.
                </p>
                <p style="font-weight: bold; color: #1f2937; margin-top: 20px;">
                  Best regards,<br/>
                  SprinterPlus Team
                </p>
              </div>
            </div>
          `
        });
      }

      clearCart();
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'orders');
    }
  };

  const login = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user') {
        return; // Just ignore it
      }
      console.error('Login Error:', error);
      throw error;
    }
  };

  const loginEmail = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (error) {
      console.error('Login Error:', error);
      throw error;
    }
  };

  const register = async (email: string, pass: string, name: string) => {
    try {
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, pass);
      try {
        await sendEmailVerification(firebaseUser);
        console.log('Firebase verification email sent successfully');
      } catch (err) {
        console.error('Firebase verification email failed to send:', err);
      }
      
      const userDoc = doc(db, 'users', firebaseUser.uid);
      const profile = {
        email,
        name,
        role: email === 'kenotube9816@gmail.com' ? 'admin' : 'customer',
        emailVerified: false,
        created: serverTimestamp()
      };
      await setDoc(userDoc, profile);

      // Send Welcome Email
      sendEmailNotification({
        to: email,
        subject: 'Welcome to SprinterPlus!',
        html: `
          <div style="font-family: sans-serif; padding: 20px;">
            <h2 style="color: #0ea5e9;">Welcome, ${name}!</h2>
            <p>Thank you for joining SprinterPlus. We are excited to have you with us.</p>
            <p>You can now browse our catalog of 50,000+ parts and see exclusive member pricing.</p>
            <p>Please check your inbox for a verification link to activate your account fully.</p>
            <p>Best regards,<br/>SprinterPlus Team</p>
          </div>
        `
      });
    } catch (error) {
      console.error('Registration Error:', error);
      throw error;
    }
  };

  const resendVerification = async () => {
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser);
    }
  };

  const checkVerificationStatus = async () => {
    if (auth.currentUser) {
      await auth.currentUser.reload();
      await syncProfile(auth.currentUser);
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const deleteUser = async (userId: string) => {
    if (user?.role !== 'admin') return;
    try {
      await deleteDoc(doc(db, 'users', userId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `users/${userId}`);
    }
  };

  const updateUser = async (u: User) => {
    if (!auth.currentUser) return;
    try {
      await updateDoc(doc(db, 'users', auth.currentUser.uid), u as any);
      setUser(u);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${auth.currentUser.uid}`);
    }
  };
  
  const addProduct = async (p: Omit<Product, 'id'>) => {
    try {
      await addDoc(collection(db, 'products'), {
        ...p,
        created: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'products');
    }
  };

  const updateProduct = async (p: Product) => {
    try {
      const { id, ...data } = p;
      await updateDoc(doc(db, 'products', String(id)), data as any);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `products/${p.id}`);
    }
  };

  const deleteProduct = async (id: string | number) => {
    try {
      await deleteDoc(doc(db, 'products', String(id)));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `products/${id}`);
    }
  };
  
  const deleteOrder = async (id: string | number) => {
    if (!id) return;
    try {
      await deleteDoc(doc(db, 'orders', String(id)));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `orders/${id}`);
    }
  };

  const toggleOrderStatus = async (order: Order) => {
    if (!order || !order.id) {
      console.error('Cannot toggle order status: missing order ID', order);
      return;
    }
    const newStatus = order.status === 'new' ? 'processed' : 'new';
    try {
      const orderRef = doc(db, 'orders', String(order.id));
      await updateDoc(orderRef, { status: newStatus });
      
      // Synchronize stock if moving to processed
      if (newStatus === 'processed') {
        const syncPromises = order.items.map(async (item) => {
          // Find product by SKU to get its ID and current quantity
          const product = products.find(p => p.sku === item.sku);
          if (product && product.id) {
            const productRef = doc(db, 'products', String(product.id));
            const newQty = Math.max(0, product.quantity - item.qty);
            await updateDoc(productRef, {
              quantity: newQty,
              instock: newQty > 0
            });
          }
        });
        await Promise.all(syncPromises);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `orders/${order.id}`);
    }
  };

  const addVehicle = async (v: Vehicle) => {
    try {
      const { id, ...data } = v;
      if (id) {
        await setDoc(doc(db, 'vehicles', String(id)), data);
      } else {
        await addDoc(collection(db, 'vehicles'), data);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'vehicles');
    }
  };

  const updateVehicle = async (v: Vehicle) => {
    try {
      const { id, ...data } = v;
      await updateDoc(doc(db, 'vehicles', String(id)), data as any);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `vehicles/${v.id}`);
    }
  };

  const deleteVehicle = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'vehicles', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `vehicles/${id}`);
    }
  };

  const isFirstDay = (() => {
    if (!user || !user.created) return false;
    const createdDate = user.created?.toDate ? user.created.toDate() : new Date(user.created);
    const now = new Date();
    const diff = now.getTime() - createdDate.getTime();
    const hours24 = 24 * 60 * 60 * 1000;
    return diff < hours24 && diff >= 0;
  })();

  return (
    <StoreContext.Provider value={{
      products, cart, orders, user, selectedVehicle, setSelectedVehicle, vehicles, addVehicle, updateVehicle, deleteVehicle,
      addToCart, removeFromCart, updateCartQty, clearCart, placeOrder,
      login, loginEmail, register, logout, resendVerification, checkVerificationStatus, users, deleteUser, addProduct, updateProduct, deleteProduct,
      deleteOrder, toggleOrderStatus, updateUser, language, setLanguage, t,
      recentlyViewed, addToRecentlyViewed,
      loading,
      isFirstDay,
      getEffectivePrice,
      getLocalized: (val) => getLocalized(val, language)
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) throw new Error('useStore must be used within a StoreProvider');
  return context;
}
