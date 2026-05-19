import { Vehicle } from '../types';

export const VEHICLE_DATA: Vehicle[] = [
  // Mercedes Sprinter
  { id: 'm-s-2006-211-cdi', make: 'Mercedes-Benz', model: 'Sprinter', year: '2006-2009', engine: '211 CDI (906)' },
  { id: 'm-s-2006-311-cdi', make: 'Mercedes-Benz', model: 'Sprinter', year: '2006-2009', engine: '311 CDI (906)' },
  { id: 'm-s-2009-313-cdi', make: 'Mercedes-Benz', model: 'Sprinter', year: '2009-2013', engine: '313 CDI (906)' },
  { id: 'm-s-2013-316-cdi', make: 'Mercedes-Benz', model: 'Sprinter', year: '2013-2018', engine: '316 CDI (906)' },
  { id: 'm-s-2018-314-cdi', make: 'Mercedes-Benz', model: 'Sprinter', year: '2018-2024', engine: '314 CDI (907)' },
  { id: 'm-s-2018-319-cdi', make: 'Mercedes-Benz', model: 'Sprinter', year: '2018-2024', engine: '319 CDI (907)' },

  // VW Transporter
  { id: 'vw-t-2003-1.9-tdi', make: 'Volkswagen', model: 'Transporter T5', year: '2003-2009', engine: '1.9 TDI' },
  { id: 'vw-t-2003-2.5-tdi', make: 'Volkswagen', model: 'Transporter T5', year: '2003-2009', engine: '2.5 TDI' },
  { id: 'vw-t-2010-2.0-tdi', make: 'Volkswagen', model: 'Transporter T5 Facelift', year: '2010-2015', engine: '2.0 TDI' },
  { id: 'vw-t-2015-2.0-tdi', make: 'Volkswagen', model: 'Transporter T6', year: '2015-2019', engine: '2.0 TDI' },
  { id: 'vw-t-2019-2.0-tdi', make: 'Volkswagen', model: 'Transporter T6.1', year: '2019-2024', engine: '2.0 TDI' },

  // Ford Transit
  { id: 'f-t-2006-2.2-tdci', make: 'Ford', model: 'Transit', year: '2006-2011', engine: '2.2 TDCi' },
  { id: 'f-t-2006-2.4-tdci', make: 'Ford', model: 'Transit', year: '2006-2011', engine: '2.4 TDCi' },
  { id: 'f-t-2011-2.2-tdci', make: 'Ford', model: 'Transit', year: '2011-2014', engine: '2.2 TDCi' },
  { id: 'f-t-2014-2.0-tdci', make: 'Ford', model: 'Transit', year: '2014-2019', engine: '2.0 TDCi' },
  { id: 'f-t-2014-2.2-tdci', make: 'Ford', model: 'Transit', year: '2014-2019', engine: '2.2 TDCi' },
  { id: 'f-f-2011-1.6-tdci', make: 'Ford', model: 'Focus Mk3', year: '2011-2018', engine: '1.6 TDCi' },
  { id: 'f-fi-2008-1.4-tdci', make: 'Ford', model: 'Fiesta MK6', year: '2008-2017', engine: '1.4 TDCi' },

  // Citroen
  { id: 'cit-c3-2009-1.4-hdi', make: 'Citroën', model: 'C3 II', year: '2009-2016', engine: '1.4 HDi' },
  { id: 'cit-c4-2010-1.6-hdi', make: 'Citroën', model: 'C4 II', year: '2010-2018', engine: '1.6 HDi' },
  { id: 'cit-ber-2008-1.6-hdi', make: 'Citroën', model: 'Berlingo II', year: '2008-2018', engine: '1.6 HDi' },

  // Renault
  { id: 'ren-dus-2010-1.5-dci', make: 'Renault', model: 'Duster I', year: '2010-2017', engine: '1.5 dCi' },
  { id: 'ren-dus-2017-1.5-dci', make: 'Renault', model: 'Duster II', year: '2017-2024', engine: '1.5 dCi' },
  { id: 'ren-dus-2017-1.3-tce', make: 'Renault', model: 'Duster II', year: '2019-2024', engine: '1.3 TCe' },
  { id: 'ren-cli-2012-1.5-dci', make: 'Renault', model: 'Clio IV', year: '2012-2019', engine: '1.5 dCi' },
  { id: 'ren-cli-2019-1.0-tce', make: 'Renault', model: 'Clio V', year: '2019-2024', engine: '1.0 TCe' },
  { id: 'ren-cap-2013-1.5-dci', make: 'Renault', model: 'Captur I', year: '2013-2019', engine: '1.5 dCi' },
  { id: 'ren-cap-2019-1.3-tce', make: 'Renault', model: 'Captur II', year: '2019-2024', engine: '1.3 TCe' },
  { id: 'ren-meg-2008-1.5-dci', make: 'Renault', model: 'Mégane III', year: '2008-2016', engine: '1.5 dCi' },
  { id: 'ren-meg-2016-1.5-dci', make: 'Renault', model: 'Mégane IV', year: '2016-2024', engine: '1.5 dCi' },
  { id: 'ren-kad-2015-1.5-dci', make: 'Renault', model: 'Kadjar', year: '2015-2022', engine: '1.5 dCi' },
  { id: 'ren-lag-2007-2.0-dci', make: 'Renault', model: 'Laguna III', year: '2007-2015', engine: '2.0 dCi' },
  { id: 'ren-sce-2009-1.5-dci', make: 'Renault', model: 'Scenic III', year: '2009-2016', engine: '1.5 dCi' },
  { id: 'ren-sce-2016-1.6-dci', make: 'Renault', model: 'Scenic IV', year: '2016-2022', engine: '1.6 dCi' },
  { id: 'ren-tal-2015-1.6-dci', make: 'Renault', model: 'Talisman', year: '2015-2022', engine: '1.6 dCi' },
  { id: 'ren-zoo-2012-elec', make: 'Renault', model: 'Zoe', year: '2012-2024', engine: 'Electric (80kW)' },
  { id: 'ren-mas-2010-2.3-dci', make: 'Renault', model: 'Master III', year: '2010-2024', engine: '2.3 dCi' },
  { id: 'ren-tra-2014-1.6-dci', make: 'Renault', model: 'Trafic III', year: '2014-2024', engine: '1.6 dCi' },
  { id: 'ren-kan-2008-1.5-dci', make: 'Renault', model: 'Kangoo II', year: '2008-2021', engine: '1.5 dCi' },
  { id: 'ren-kan-2021-1.5-dci', make: 'Renault', model: 'Kangoo III', year: '2021-2024', engine: '1.5 dCi' },
  { id: 'ren-esp-2002-2.2-dci', make: 'Renault', model: 'Espace IV', year: '2002-2014', engine: '2.2 dCi' },
  { id: 'ren-esp-2015-1.6-dci', make: 'Renault', model: 'Espace V', year: '2015-2023', engine: '1.6 dCi' },
  { id: 'ren-esp-2023-e-tech', make: 'Renault', model: 'Espace VI', year: '2023-2024', engine: 'E-Tech Full Hybrid 200' },

  // Fiat
  { id: 'fiat-500-2007-1.3-jtd', make: 'Fiat', model: '500', year: '2007-2024', engine: '1.3 Multijet' },
  { id: 'fiat-pun-2005-1.3-jtd', make: 'Fiat', model: 'Grande Punto', year: '2005-2018', engine: '1.3 Multijet' },
  { id: 'fiat-dob-2010-1.6-jtd', make: 'Fiat', model: 'Doblo II', year: '2010-2022', engine: '1.6 Multijet' },

  // Suzuki
  { id: 'suz-swi-2010-1.2', make: 'Suzuki', model: 'Swift IV', year: '2010-2017', engine: '1.2 VVT' },
  { id: 'suz-vit-2015-1.6', make: 'Suzuki', model: 'Vitara IV', year: '2015-2024', engine: '1.6 VVT' },

  // Mercedes-Benz expanded
  { id: 'm-a-2012-a180', make: 'Mercedes-Benz', model: 'A-Class (W176)', year: '2012-2018', engine: 'A180 CDI' },
  { id: 'm-a-2012-a200', make: 'Mercedes-Benz', model: 'A-Class (W176)', year: '2012-2018', engine: 'A200 CDI' },
  { id: 'm-a-2018-a180d', make: 'Mercedes-Benz', model: 'A-Class (W177)', year: '2018-2024', engine: 'A180d' },
  { id: 'm-e-2002-e220', make: 'Mercedes-Benz', model: 'E-Class (W211)', year: '2002-2009', engine: 'E220 CDI' },
  { id: 'm-e-2009-e220', make: 'Mercedes-Benz', model: 'E-Class (W212)', year: '2009-2016', engine: 'E220 BlueTEC' },
  { id: 'm-e-2016-e220d', make: 'Mercedes-Benz', model: 'E-Class (W213)', year: '2016-2023', engine: 'E220d' },
  { id: 'm-c-2014-c220', make: 'Mercedes-Benz', model: 'C-Class (W205)', year: '2014-2021', engine: 'C220 BlueTEC' },
  { id: 'm-cls-2011-cls350', make: 'Mercedes-Benz', model: 'CLS (C218)', year: '2011-2018', engine: 'CLS 350 CDI' },

  // common passenger cars
  // Volkswagen expanded
  { id: 'vw-golf-2-gti', make: 'Volkswagen', model: 'Golf II', year: '1983-1992', engine: '1.8 GTI' },
  { id: 'vw-golf-3-1.9-tdi', make: 'Volkswagen', model: 'Golf III', year: '1991-1998', engine: '1.9 TDI' },
  { id: 'vw-golf-4-1.9-tdi', make: 'Volkswagen', model: 'Golf IV', year: '1997-2003', engine: '1.9 TDI' },
  { id: 'vw-golf-5-2.0-tdi', make: 'Volkswagen', model: 'Golf V', year: '2003-2008', engine: '2.0 TDI' },
  { id: 'vw-golf-6-2.0-tdi', make: 'Volkswagen', model: 'Golf VI', year: '2008-2012', engine: '2.0 TDI' },
  { id: 'vw-golf-8-2020-2.0-tdi', make: 'Volkswagen', model: 'Golf VIII', year: '2020-2024', engine: '2.0 TDI' },
  { id: 'vw-golf-8.5-2024', make: 'Volkswagen', model: 'Golf VIII.5', year: '2024-2025', engine: '1.5 TSI' },
  { id: 'vw-polo-2017-1.0-tsi', make: 'Volkswagen', model: 'Polo', year: '2017-2024', engine: '1.0 TSI' },
  { id: 'vw-caddy-2020-2.0-tdi', make: 'Volkswagen', model: 'Caddy', year: '2020-2024', engine: '2.0 TDI' },
  { id: 'vw-tiguan-2016-2.0-tdi', make: 'Volkswagen', model: 'Tiguan', year: '2016-2024', engine: '2.0 TDI' },
  { id: 'vw-touareg-2018-3.0-tdi', make: 'Volkswagen', model: 'Touareg', year: '2018-2024', engine: '3.0 TDI' },
  { id: 'vw-arteon-2017-2.0-tdi', make: 'Volkswagen', model: 'Arteon', year: '2017-2024', engine: '2.0 TDI' },
  { id: 'vw-t-roc-2017-1.5-tsi', make: 'Volkswagen', model: 'T-Roc', year: '2017-2024', engine: '1.5 TSI' },
  { id: 'vw-t-cross-2019-1.0-tsi', make: 'Volkswagen', model: 'T-Cross', year: '2019-2024', engine: '1.0 TSI' },
  { id: 'vw-id3-2020-pro', make: 'Volkswagen', model: 'ID.3', year: '2020-2024', engine: 'Electric (150kW)' },
  { id: 'vw-id4-2021-pro', make: 'Volkswagen', model: 'ID.4', year: '2021-2024', engine: 'Electric (150kW)' },
  { id: 'vw-crafter-2017-2.0-tdi', make: 'Volkswagen', model: 'Crafter', year: '2017-2024', engine: '2.0 TDI' },
  { id: 'vw-up-2016-1.0', make: 'Volkswagen', model: 'up!', year: '2016-2024', engine: '1.0' },
  { id: 'vw-sharan-2010-2.0-tdi', make: 'Volkswagen', model: 'Sharan', year: '2010-2024', engine: '2.0 TDI' },
  { id: 'vw-touran-2015-1.6-tdi', make: 'Volkswagen', model: 'Touran', year: '2015-2024', engine: '1.6 TDI' },
  { id: 'vw-amarok-2016-3.0-v6', make: 'Volkswagen', model: 'Amarok', year: '2016-2024', engine: '3.0 V6 TDI' },

  { id: 'vw-g7-2013-1.6-tdi', make: 'Volkswagen', model: 'Golf VII', year: '2013-2020', engine: '1.6 TDI' },
  { id: 'vw-g7-2013-2.0-tdi', make: 'Volkswagen', model: 'Golf VII', year: '2013-2020', engine: '2.0 TDI' },
  { id: 'vw-p-2015-2.0-tdi', make: 'Volkswagen', model: 'Passat B8', year: '2015-2023', engine: '2.0 TDI' },
  { id: 'audi-a4-2016-2.0-tdi', make: 'Audi', model: 'A4 (B9)', year: '2016-2024', engine: '2.0 TDI' },
  { id: 'audi-a6-2014-3.0-tdi', make: 'Audi', model: 'A6 (C7)', year: '2014-2018', engine: '3.0 TDI' },
  { id: 'bmw-3-2012-320d', make: 'BMW', model: '3 Series (F30)', year: '2012-2019', engine: '320d' },
  { id: 'bmw-5-2017-530d', make: 'BMW', model: '5 Series (G30)', year: '2017-2023', engine: '530d' },
];

export const getMakes = () => Array.from(new Set(VEHICLE_DATA.map(v => v.make))).sort();
export const getModels = (make: string) => Array.from(new Set(VEHICLE_DATA.filter(v => v.make === make).map(v => v.model))).sort();
export const getYears = (make: string, model: string) => Array.from(new Set(VEHICLE_DATA.filter(v => v.make === make && v.model === model).map(v => v.year))).sort((a, b) => String(b).localeCompare(String(a)));
export const getEngines = (make: string, model: string, year: string) => Array.from(new Set(VEHICLE_DATA.filter(v => v.make === make && v.model === model && v.year === year).map(v => v.engine))).sort();
export const getVehicleId = (make: string, model: string, year: string, engine: string) => VEHICLE_DATA.find(v => v.make === make && v.model === model && v.year === year && v.engine === engine)?.id;
