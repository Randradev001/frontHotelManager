const siNoOptions = [
  { value: 1, label: 'SI' },
  { value: 0, label: 'NO' }
];

const regionOptions = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'RM'].map((region) => ({
  value: region,
  label: region
}));

export const TEMP_SESSION_CONTEXT = {
  EmpCod: 1,
  Login: 'MIGRACION'
};

const companyContext = {
  EmpCod: TEMP_SESSION_CONTEXT.EmpCod
};

const especieSource = {
  source: 'especies',
  valueField: 'Especod',
  labelField: 'EspeNom',
  lookup: true
};

const envaseSource = {
  source: 'envases',
  valueField: 'EnvCod',
  labelField: 'EnvNom',
  lookup: true
};

const productorSource = {
  source: 'productores',
  valueField: 'ProdCod',
  labelField: 'ProdNom',
  lookup: true
};

const comunaSource = {
  source: 'comunas',
  valueField: 'Comdesc',
  labelField: 'Comdesc',
  lookup: true
};

const numberField = (name, label, options = {}) => ({
  name,
  label,
  type: 'number',
  width: options.width || 110,
  formSize: options.formSize || { xs: 12, md: 3 },
  required: options.required || false,
  options: options.options,
  optionSource: options.optionSource,
  defaultValue: options.defaultValue,
  min: options.min,
  exclusiveMin: options.exclusiveMin,
  readOnly: options.readOnly || false,
  contextOnly: options.contextOnly || false,
  hidden: options.hidden || false
});

const textField = (name, label, maxLength, options = {}) => ({
  name,
  label,
  type: 'text',
  maxLength,
  width: options.width || 160,
  minWidth: options.minWidth,
  flex: options.flex,
  formSize: options.formSize || { xs: 12, md: 6 },
  required: options.required || false,
  options: options.options,
  optionSource: options.optionSource,
  defaultValue: options.defaultValue,
  readOnly: options.readOnly || false,
  contextOnly: options.contextOnly || false,
  hidden: options.hidden || false
});

const decimalField = (name, label, options = {}) => ({
  name,
  label,
  type: 'decimal',
  width: options.width || 140,
  formSize: options.formSize || { xs: 12, md: 3 },
  required: options.required || false,
  defaultValue: options.defaultValue,
  min: options.min,
  exclusiveMin: options.exclusiveMin,
  readOnly: options.readOnly || false,
  contextOnly: options.contextOnly || false,
  hidden: options.hidden || false
});

const dateField = (name, label, options = {}) => ({
  name,
  label,
  type: 'date',
  width: options.width || 150,
  formSize: options.formSize || { xs: 12, md: 4 },
  required: options.required || false,
  defaultValue: options.defaultValue,
  readOnly: options.readOnly || false,
  contextOnly: options.contextOnly || false,
  hidden: options.hidden || false
});

export const gxMaestrosConfig = {
  empresas: {
    title: 'Definicion de Empresa',
    table: 'DEFEMP',
    level: 1,
    apiName: 'empresas',
    route: '/maestros-gx/empresas',
    contextParams: companyContext,
    primaryKey: ['EmpCod'],
    fields: [
      numberField('EmpCod', 'Codigo empresa (EmpCod)', {
        required: true,
        min: 1,
        defaultValue: TEMP_SESSION_CONTEXT.EmpCod,
        contextOnly: true,
        hidden: true
      }),
      textField('EmpNom', 'Nombre empresa (EmpNom)', 50, { flex: 1, minWidth: 240, required: true }),
      textField('EmpGiro', 'Giro comercial (EmpGiro)', 35, { minWidth: 200 }),
      textField('Empdir', 'Direccion (Empdir)', 30, { minWidth: 190 }),
      numberField('EmpRut', 'RUT empresa (EmpRut)', { width: 140 }),
      textField('EmpDV', 'Digito verificador (EmpDV)', 1, { width: 150, formSize: { xs: 12, md: 3 } }),
      textField('EmpRepre', 'Representante legal (EmpRepre)', 20, { minWidth: 190 }),
      numberField('EmpSw', 'Estado empresa (EmpSw)', { width: 150 }),
      numberField('EmpPar1', 'Parametro 1 (EmpPar1)', { width: 150 }),
      numberField('EmpPar2', 'Parametro 2 (EmpPar2)', { width: 150 }),
      textField('empreg', 'Region empresa (empreg)', 4, { width: 160, formSize: { xs: 12, md: 3 }, options: regionOptions }),
      numberField('empSisProd', 'Sistema produccion (empSisProd)', { width: 190, options: siNoOptions }),
      numberField('EmpTempLot', 'Temporada lotes (EmpTempLot)', { width: 180 }),
      numberField('EmpCodSAG', 'Codigo SAG (EmpCodSAG)', { width: 170 }),
      textField('EmpCodCom', 'Codigo comuna (EmpCodCom)', 20, { width: 180 }),
      textField('EmpRutIMG', 'Imagen RUT (EmpRutIMG)', 100, { minWidth: 220, formSize: { xs: 12, md: 8 } }),
      numberField('EmpTReg', 'Tipo registro (EmpTReg)', { width: 160, options: siNoOptions }),
      textField('Empprov', 'Provincia (Empprov)', 20, { width: 170 }),
      textField('Empcom', 'Comuna (Empcom)', 20, { width: 170 })
    ]
  },
  temporadas: {
    title: 'Temporadas',
    table: 'TEMP01',
    level: 1,
    parentTable: 'DEFEMP',
    apiName: 'temporadas',
    route: '/maestros-gx/temporadas',
    contextParams: companyContext,
    primaryKey: ['EmpCod', 'TempCod'],
    fields: [
      numberField('EmpCod', 'Empresa (EmpCod)', { required: true, min: 1, defaultValue: TEMP_SESSION_CONTEXT.EmpCod, contextOnly: true, hidden: true }),
      textField('TempCod', 'Codigo temporada (TempCod)', 9, { required: true, formSize: { xs: 12, md: 4 } }),
      textField('TempDes', 'Descripcion temporada (TempDes)', 20, { flex: 1, minWidth: 240, required: true }),
      dateField('TempFecAbre', 'Fecha apertura (TempFecAbre)', {
        defaultValue: new Date().toISOString().slice(0, 10),
        readOnly: true
      }),
      textField('TempLogA', 'Usuario apertura (TempLogA)', 10, {
        defaultValue: TEMP_SESSION_CONTEXT.Login,
        readOnly: true,
        formSize: { xs: 12, md: 4 }
      }),
      dateField('TempFecCierra', 'Fecha cierre (TempFecCierra)'),
      textField('TempLogC', 'Usuario cierre (TempLogC)', 10, { formSize: { xs: 12, md: 4 } }),
      numberField('TempActiva', 'Temporada activa (TempActiva)', { width: 180, options: siNoOptions, defaultValue: 1 })
    ]
  },
  especies: {
    title: 'Especies',
    table: 'ESPECIES',
    level: 1,
    parentTable: 'DEFEMP',
    apiName: 'especies',
    route: '/maestros-gx/especies',
    contextParams: companyContext,
    primaryKey: ['EmpCod', 'Especod'],
    fields: [
      numberField('EmpCod', 'Empresa (EmpCod)', { required: true, min: 1, defaultValue: TEMP_SESSION_CONTEXT.EmpCod, contextOnly: true, hidden: true }),
      numberField('Especod', 'Codigo especie (Especod)', { required: true, min: 1, width: 160 }),
      textField('EspeNom', 'Nombre especie (EspeNom)', 20, { flex: 1, minWidth: 240, required: true }),
      numberField('EspeDiaV', 'Dias vida (EspeDiaV)', { width: 150 }),
      numberField('EspeSag', 'Codigo SAG especie (EspeSag)', { width: 190 }),
      textField('EspeNomC', 'Nombre corto (EspeNomC)', 4, { required: true, width: 170, formSize: { xs: 12, md: 3 } }),
      textField('EspePLU', 'PLU especie (EspePLU)', 15, { width: 170, formSize: { xs: 12, md: 4 } }),
      numberField('EspeCMP', 'Codigo CMP (EspeCMP)', { width: 160 }),
      textField('EspeNomExt', 'Nombre externo (EspeNomExt)', 20, { minWidth: 200 }),
      textField('EspeNMP', 'Nombre Multipuerto (EspeNMP)', 100, { minWidth: 240 }),
      textField('EspeSECod', 'Codigo SE (EspeSECod)', 10, { width: 170, formSize: { xs: 12, md: 4 } })
    ]
  },
  variedades: {
    title: 'Variedades',
    table: 'ESPECIES1',
    level: 2,
    parentTable: 'ESPECIES',
    apiName: 'variedades',
    route: '/maestros-gx/variedades',
    contextParams: companyContext,
    primaryKey: ['EmpCod', 'Especod', 'VarCod'],
    filters: [
      {
        name: 'Especod',
        label: 'Especie (Especod)',
        source: 'especies',
        valueField: 'Especod',
        labelField: 'EspeNom',
        required: true
      }
    ],
    fields: [
      numberField('EmpCod', 'Empresa (EmpCod)', { required: true, min: 1, defaultValue: TEMP_SESSION_CONTEXT.EmpCod, contextOnly: true, hidden: true }),
      numberField('Especod', 'Especie (Especod)', { required: true, min: 1, optionSource: especieSource }),
      numberField('VarCod', 'Codigo variedad (VarCod)', { required: true, min: 1, width: 170 }),
      textField('VarNom', 'Nombre variedad (VarNom)', 20, { flex: 1, minWidth: 240, required: true }),
      textField('varnomC', 'Nombre corto (varnomC)', 4, { required: true, width: 170, formSize: { xs: 12, md: 3 } }),
      textField('VarPLU', 'PLU variedad (VarPLU)', 15, { width: 170, formSize: { xs: 12, md: 4 } }),
      textField('VarSECod', 'Codigo SE (VarSECod)', 10, { width: 170, formSize: { xs: 12, md: 4 } })
    ]
  },
  envases: {
    title: 'Envases',
    table: 'ENVCAT',
    level: 1,
    parentTable: 'DEFEMP',
    apiName: 'envases',
    route: '/maestros-gx/envases',
    contextParams: companyContext,
    primaryKey: ['EmpCod', 'EnvCod'],
    fields: [
      numberField('EmpCod', 'Empresa (EmpCod)', { required: true, min: 1, defaultValue: TEMP_SESSION_CONTEXT.EmpCod, contextOnly: true, hidden: true }),
      numberField('EnvCod', 'Codigo envase (EnvCod)', { required: true, min: 1, width: 160 }),
      textField('EnvNom', 'Nombre envase (EnvNom)', 20, { flex: 1, minWidth: 240, required: true }),
      decimalField('EnvPeso', 'Peso envase (EnvPeso)', { required: true, exclusiveMin: 0, width: 160 }),
      decimalField('EnvDestare', 'Destare envase (EnvDestare)', { width: 190 }),
      decimalField('EnvPesoB', 'Peso B (EnvPesoB)', { width: 160 }),
      numberField('EnvUso', 'Uso envase (EnvUso)', { required: true, min: 1, defaultValue: 1, width: 150 }),
      textField('EnvnomC', 'Nombre corto (EnvnomC)', 10, { width: 170, formSize: { xs: 12, md: 3 } }),
      numberField('EnvCMP', 'Codigo CMP envase (EnvCMP)', { width: 190 }),
      textField('EnvNomExt', 'Nombre externo (EnvNomExt)', 20, { minWidth: 210 }),
      textField('EnvNMP', 'Envase Multipuerto (EnvNMP)', 20, { minWidth: 210 }),
      textField('EnvSECod', 'Codigo SE envase (EnvSECod)', 10, { width: 190, formSize: { xs: 12, md: 4 } })
    ]
  },
  categoriasEnvase: {
    title: 'Categorias de Envase',
    table: 'ENVCAT1',
    level: 2,
    parentTable: 'ENVCAT',
    apiName: 'categoriasEnvase',
    route: '/maestros-gx/categorias-envase',
    contextParams: companyContext,
    primaryKey: ['EmpCod', 'EnvCod', 'Catcod'],
    filters: [
      {
        name: 'EnvCod',
        label: 'Envase (EnvCod)',
        source: 'envases',
        valueField: 'EnvCod',
        labelField: 'EnvNom',
        required: true
      }
    ],
    fields: [
      numberField('EmpCod', 'Empresa (EmpCod)', { required: true, min: 1, defaultValue: TEMP_SESSION_CONTEXT.EmpCod, contextOnly: true, hidden: true }),
      numberField('EnvCod', 'Envase (EnvCod)', { required: true, min: 1, optionSource: envaseSource }),
      numberField('Catcod', 'Codigo categoria (Catcod)', { required: true, min: 1, width: 180 }),
      textField('CatNom', 'Nombre categoria (CatNom)', 20, { flex: 1, minWidth: 240, required: true }),
      textField('CatNomC', 'Nombre corto (CatNomC)', 4, { required: true, width: 170, formSize: { xs: 12, md: 3 } }),
      textField('CatnomExt', 'Nombre externo (CatnomExt)', 20, { minWidth: 210 }),
      textField('CatSECod', 'Codigo SE categoria (CatSECod)', 10, { width: 210, formSize: { xs: 12, md: 4 } })
    ]
  },
  calibres: {
    title: 'Calibres',
    table: 'CALIBRES',
    level: 1,
    parentTable: 'ESPECIES',
    apiName: 'calibres',
    route: '/maestros-gx/calibres',
    contextParams: companyContext,
    primaryKey: ['EmpCod', 'Especod', 'Calibre'],
    filters: [
      {
        name: 'Especod',
        label: 'Especie (Especod)',
        source: 'especies',
        valueField: 'Especod',
        labelField: 'EspeNom',
        required: true
      }
    ],
    fields: [
      numberField('EmpCod', 'Empresa (EmpCod)', { required: true, min: 1, defaultValue: TEMP_SESSION_CONTEXT.EmpCod, contextOnly: true, hidden: true }),
      numberField('Especod', 'Especie (Especod)', { required: true, min: 1, optionSource: especieSource }),
      textField('Calibre', 'Calibre (Calibre)', 10, { width: 170, required: true, formSize: { xs: 12, md: 4 } }),
      numberField('CalCod', 'Codigo orden calibre (CalCod)', { min: 1, readOnly: true, width: 220 })
    ]
  },
  productores: {
    title: 'Productores',
    table: 'PRODUCTORES',
    level: 1,
    parentTable: 'DEFEMP',
    apiName: 'productores',
    route: '/maestros-gx/productores',
    contextParams: companyContext,
    primaryKey: ['EmpCod', 'ProdCod'],
    fields: [
      numberField('EmpCod', 'Empresa (EmpCod)', { required: true, min: 1, defaultValue: TEMP_SESSION_CONTEXT.EmpCod, contextOnly: true, hidden: true }),
      textField('ProdCod', 'Codigo productor (ProdCod)', 6, { width: 180, required: true, formSize: { xs: 12, md: 4 } }),
      textField('ProdNom', 'Nombre productor (ProdNom)', 35, { flex: 1, minWidth: 260, required: true }),
      numberField('ProdRut', 'RUT productor (ProdRut)', { width: 170 }),
      textField('ProdDv', 'Digito verificador (ProdDv)', 1, { width: 170, formSize: { xs: 12, md: 3 } }),
      textField('ProdComuna', 'Comuna productor (ProdComuna)', 20, { width: 210, optionSource: comunaSource }),
      textField('ProdProvincia', 'Provincia productor (ProdProvincia)', 20, { width: 230 }),
      textField('ProdPack', 'Packing productor (ProdPack)', 30, { minWidth: 230 }),
      textField('ProdPackCom', 'Comuna packing (ProdPackCom)', 20, { width: 210, optionSource: comunaSource }),
      textField('ProdPackProv', 'Provincia packing (ProdPackProv)', 20, { width: 230 }),
      textField('ProdCodExt', 'Codigo externo (ProdCodExt)', 10, { width: 180, formSize: { xs: 12, md: 4 } }),
      textField('Prodnom2', 'Nombre alternativo (Prodnom2)', 20, { minWidth: 220 }),
      textField('ProdCodSAG', 'Codigo SAG productor (ProdCodSAG)', 10, { required: true, width: 220, formSize: { xs: 12, md: 4 } }),
      textField('ProdSECod', 'Codigo SE productor (ProdSECod)', 10, { width: 210, formSize: { xs: 12, md: 4 } })
    ]
  },
  cuarteles: {
    title: 'Cuarteles',
    table: 'PRODUCTORES1',
    level: 2,
    parentTable: 'PRODUCTORES',
    apiName: 'cuarteles',
    route: '/maestros-gx/cuarteles',
    contextParams: companyContext,
    primaryKey: ['EmpCod', 'ProdCod', 'CuarCod'],
    filters: [
      {
        name: 'ProdCod',
        label: 'Productor (ProdCod)',
        source: 'productores',
        valueField: 'ProdCod',
        labelField: 'ProdNom',
        required: true
      }
    ],
    fields: [
      numberField('EmpCod', 'Empresa (EmpCod)', { required: true, min: 1, defaultValue: TEMP_SESSION_CONTEXT.EmpCod, contextOnly: true, hidden: true }),
      textField('ProdCod', 'Productor (ProdCod)', 6, { required: true, optionSource: productorSource }),
      numberField('CuarCod', 'Codigo cuartel (CuarCod)', { required: true, min: 1, width: 180 }),
      textField('CuarNom', 'Nombre cuartel (CuarNom)', 35, { required: true, flex: 1, minWidth: 260 }),
      textField('CuarnomC', 'Nombre corto (CuarnomC)', 4, { required: true, width: 180, formSize: { xs: 12, md: 3 } })
    ]
  }
};

export const gxMaestrosMenu = ['empresas', 'temporadas', 'envases', 'categoriasEnvase', 'especies', 'variedades', 'productores', 'cuarteles', 'calibres'];
