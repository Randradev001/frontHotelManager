const numberField = (name, label, options = {}) => ({
  name,
  label,
  type: 'number',
  width: options.width || 120,
  formSize: options.formSize || { xs: 12, md: 4 },
  ...options
});

const textField = (name, label, maxLength, options = {}) => ({
  name,
  label,
  type: options.type || 'text',
  maxLength,
  width: options.width || 180,
  formSize: options.formSize || { xs: 12, md: 6 },
  ...options
});

const dateField = (name, label, options = {}) => ({
  name,
  label,
  type: 'date',
  width: options.width || 150,
  formSize: options.formSize || { xs: 12, md: 4 },
  ...options
});

const userSource = { source: 'usuarios', sourceApi: 'seguridad', valueField: 'UsuLogin', labelField: 'Usunom', lookup: true };
const systemSource = { source: 'sistemas', sourceApi: 'seguridad', valueField: 'SistCod', labelField: 'SistNombre' };
const moduleSource = { source: 'modulos', sourceApi: 'seguridad', valueField: 'Modcod', labelField: 'ModDes', lookup: true };
const programSource = { source: 'programas', sourceApi: 'seguridad', valueField: 'ProgCod', labelField: 'ProgDes', lookup: true };
const actionSource = { source: 'programaAcciones', sourceApi: 'seguridad', valueField: 'ProgOPCod', labelField: 'ProgOPDes', lookup: true };
const roleSource = { source: 'roles', sourceApi: 'seguridad', valueField: 'ROLCod', labelField: 'ROLNombre' };

const companyField = (name = 'GECODEMP') => numberField(name, 'Empresa', { hidden: true, contextOnly: true, required: true });

const userStatusOptions = [
  { value: 1, label: 'Activo' },
  { value: 0, label: 'Inactivo' }
];

const userTypeOptions = [
  { value: 0, label: 'Usuario' },
  { value: 1, label: 'Administrador' }
];

export const gxSecurityConfig = {
  usuarios: {
    title: 'Usuarios',
    gxObject: 'Usuarios',
    table: 'USUARIOS',
    level: 1,
    apiName: 'usuarios',
    roleAssignmentManager: true,
    userAssignmentsManager: true,
    sessionCompanyField: 'GECODEMP',
    primaryKey: ['GECODEMP', 'UsuLogin'],
    fields: [
      companyField(),
      textField('UsuLogin', 'Usuario', 10, { required: true, width: 140 }),
      textField('UsuClave', 'Clave', 64, { type: 'password', listHidden: true, formSize: { xs: 12, md: 4 } }),
      numberField('UsuRut', 'RUT', { required: true, width: 130 }),
      textField('UsuDV', 'Digito verificador', 1, { required: true, width: 130, formSize: { xs: 12, md: 2 } }),
      textField('Usunom', 'Nombre', 35, { required: true, flex: 1, minWidth: 220 }),
      textField('UsuCargo', 'Cargo', 30),
      dateField('UsuExpira', 'Fecha de expiracion'),
      textField('usucrea', 'Creado por', 10, { readOnly: true, width: 140 }),
      numberField('UsuNseg', 'Nivel de seguridad', { width: 170 }),
      textField('UsuCorreo', 'Correo electronico', 30, { minWidth: 210 }),
      numberField('UsuEstado', 'Estado', { required: true, defaultValue: 1, width: 130, options: userStatusOptions }),
      textField('UsuPerfil', 'Perfil', 10, { width: 140 }),
      numberField('UsuTipo', 'Tipo de usuario', { required: true, defaultValue: 0, width: 160, options: userTypeOptions })
    ]
  },
  roles: {
    title: 'Definicion de roles',
    gxObject: 'UROLES',
    table: 'UROLES',
    level: 1,
    apiName: 'roles',
    rolePermissionsManager: true,
    primaryKey: ['ROLCod'],
    fields: [
      textField('ROLCod', 'Rol', 10, { required: true, width: 150 }),
      textField('ROLNombre', 'Nombre del rol', 30, { required: true, flex: 1, minWidth: 240 }),
      numberField('AssignedUsers', 'Usuarios asignados', { readOnly: true, formHidden: true, width: 170 }),
      numberField('AssignedPrograms', 'Programas asignados', { readOnly: true, formHidden: true, width: 180 }),
      dateField('ROLFCrea', 'Fecha de creacion', { readOnly: true }),
      textField('ROLUCrea', 'Creado por', 10, { readOnly: true, width: 140 })
    ]
  },
  rolesUsuarios: {
    title: 'Roles por usuario',
    gxObject: 'URolesPorUser',
    table: 'URolesPorUser',
    level: 1,
    apiName: 'rolesUsuarios',
    sessionCompanyField: 'GECODEMP',
    disableEdit: true,
    roleAssignmentManager: true,
    rolePermissionsFromAssignment: true,
    createLabel: 'Asignar rol',
    primaryKey: ['GECODEMP', 'UsuLogin', 'ROLCod'],
    filters: [
      { name: 'UsuLogin', label: 'Usuario', ...userSource },
      { name: 'ROLCod', label: 'Rol', ...roleSource }
    ],
    fields: [
      companyField(),
      textField('UsuLogin', 'Usuario', 10, {
        required: true,
        optionSource: userSource,
        flex: 1,
        minWidth: 180
      }),
      textField('ROLCod', 'Rol', 10, {
        required: true,
        optionSource: roleSource,
        flex: 1,
        minWidth: 180
      }),
      dateField('RXUFecCrea', 'Fecha de asignacion', { readOnly: true, flex: 0.7, minWidth: 180 })
    ]
  },
  sistemas: {
    title: 'Sistemas',
    gxObject: 'Sistemas',
    table: 'SISTEMAS',
    level: 1,
    apiName: 'sistemas',
    primaryKey: ['SistCod'],
    fields: [
      numberField('SistCod', 'Codigo del sistema', { required: true, min: 1, width: 160 }),
      textField('SistNombre', 'Nombre del sistema', 40, { required: true, flex: 1, minWidth: 260 }),
      dateField('SistFecCrea', 'Fecha de creacion', { readOnly: true }),
      textField('SistFAIcons', 'Icono', 30, { width: 170 })
    ]
  },
  modulos: {
    title: 'Modulos',
    gxObject: 'Modulos',
    table: 'MODULOS',
    level: 1,
    apiName: 'modulos',
    primaryKey: ['SistCod', 'Modcod'],
    filters: [{ name: 'SistCod', label: 'Sistema', ...systemSource }],
    fields: [
      numberField('SistCod', 'Sistema', { required: true, optionSource: systemSource }),
      numberField('Modcod', 'Codigo del modulo', { required: true, min: 1, width: 170 }),
      numberField('ModTipo', 'Tipo de modulo', { required: true, defaultValue: 1, width: 150 }),
      textField('Modprg', 'Programa inicial', 15, { width: 170 }),
      textField('ModDes', 'Descripcion', 30, { required: true, flex: 1, minWidth: 230 }),
      dateField('ModFcrea', 'Fecha de creacion', { readOnly: true }),
      textField('ModFAIcons', 'Icono', 30, { width: 170 })
    ]
  },
  programas: {
    title: 'Programas',
    gxObject: 'Program',
    table: 'PROGRAM',
    level: 1,
    apiName: 'programas',
    primaryKey: ['SistCod', 'Modcod', 'ProgCod'],
    filters: [
      { name: 'SistCod', label: 'Sistema', ...systemSource },
      { name: 'Modcod', label: 'Modulo', ...moduleSource }
    ],
    fields: [
      numberField('SistCod', 'Sistema', { required: true, optionSource: systemSource }),
      numberField('Modcod', 'Modulo', { required: true, optionSource: moduleSource }),
      numberField('ProgCod', 'Codigo del programa', { required: true, min: 1, width: 180 }),
      textField('ProgDes', 'Descripcion', 35, { required: true, flex: 1, minWidth: 230 }),
      dateField('ProgFcrea', 'Fecha de creacion', { readOnly: true }),
      numberField('ProgTipo', 'Tipo de programa', { width: 160 }),
      textField('ProgNomGX', 'Nombre GeneXus', 20, { minWidth: 190 }),
      textField('ProgIDmenu', 'Identificador de menu', 20, { minWidth: 190 }),
      textField('ProgTarget', 'Destino', 120, { minWidth: 170 })
    ]
  },
  programaAcciones: {
    title: 'Acciones de programas',
    gxObject: 'Program',
    table: 'PROGRAM1',
    level: 2,
    parentTable: 'PROGRAM',
    apiName: 'programaAcciones',
    primaryKey: ['SistCod', 'Modcod', 'ProgCod', 'ProgOPCod'],
    filters: [
      { name: 'SistCod', label: 'Sistema', required: true, ...systemSource },
      { name: 'Modcod', label: 'Modulo', required: true, ...moduleSource },
      { name: 'ProgCod', label: 'Programa', required: true, ...programSource }
    ],
    fields: [
      numberField('SistCod', 'Sistema', { required: true, optionSource: systemSource }),
      numberField('Modcod', 'Modulo', { required: true, optionSource: moduleSource }),
      numberField('ProgCod', 'Programa', { required: true, optionSource: programSource }),
      numberField('ProgOPCod', 'Codigo de la accion', { required: true, min: 1, width: 170 }),
      textField('ProgOPDes', 'Descripcion de la accion', 35, { required: true, flex: 1, minWidth: 250 })
    ]
  },
  niveles: {
    title: 'Niveles de seguridad',
    gxObject: 'NivSeg',
    table: 'NIVSEG',
    level: 1,
    apiName: 'niveles',
    primaryKey: ['NSegMod', 'NSegProg'],
    fields: [
      numberField('NSegMod', 'Nivel del modulo', { required: true, min: 1, width: 160 }),
      textField('NSegDMod', 'Descripcion del modulo', 30, { minWidth: 210 }),
      numberField('NSegProg', 'Nivel del programa', { required: true, min: 1, width: 170 }),
      textField('NsegDes', 'Descripcion', 35, { flex: 1, minWidth: 220 }),
      numberField('NSegIns', 'Nivel para ingresar'),
      numberField('NsegUPD', 'Nivel para actualizar'),
      numberField('NsegDel', 'Nivel para eliminar'),
      numberField('NsegPRC', 'Nivel para procesar'),
      textField('NsegLogA', 'Creado por', 10, { readOnly: true, width: 140 })
    ]
  },
  asignacionesSistemas: {
    title: 'Sistemas por usuario',
    gxObject: 'AsigSist',
    table: 'ASIGSIST',
    level: 1,
    apiName: 'asignacionesSistemas',
    sessionCompanyField: 'GECODEMP',
    disableEdit: true,
    primaryKey: ['GECODEMP', 'AsgSisLogin', 'SistCod'],
    filters: [{ name: 'AsgSisLogin', label: 'Usuario', ...userSource }],
    fields: [
      companyField(),
      textField('AsgSisLogin', 'Usuario', 10, { required: true, optionSource: userSource }),
      numberField('SistCod', 'Sistema', { required: true, optionSource: systemSource })
    ]
  },
  asignacionesModulos: {
    title: 'Modulos por usuario',
    gxObject: 'Asig',
    table: 'ASIG',
    level: 1,
    apiName: 'asignacionesModulos',
    sessionCompanyField: 'GECODEMP',
    disableEdit: true,
    primaryKey: ['GECODEMP', 'AsigUsu', 'SistCod', 'AsigMod'],
    filters: [
      { name: 'AsigUsu', label: 'Usuario', ...userSource },
      { name: 'SistCod', label: 'Sistema', ...systemSource }
    ],
    fields: [
      companyField(),
      textField('AsigUsu', 'Usuario', 10, { required: true, optionSource: userSource }),
      numberField('SistCod', 'Sistema', { required: true, optionSource: systemSource }),
      numberField('AsigMod', 'Modulo', { required: true, optionSource: moduleSource }),
      textField('AsigAsig', 'Asignado por', 10, { readOnly: true, width: 140 })
    ]
  },
  asignacionesProgramas: {
    title: 'Programas por usuario',
    gxObject: 'AsigProg',
    table: 'ASIGPROG',
    level: 1,
    apiName: 'asignacionesProgramas',
    sessionCompanyField: 'GECODEMP',
    disableEdit: true,
    primaryKey: ['GECODEMP', 'UsuLogin', 'SistCod', 'Modcod', 'ProgCod'],
    filters: [
      { name: 'UsuLogin', label: 'Usuario', ...userSource },
      { name: 'SistCod', label: 'Sistema', ...systemSource },
      { name: 'Modcod', label: 'Modulo', ...moduleSource }
    ],
    fields: [
      companyField(),
      textField('UsuLogin', 'Usuario', 10, { required: true, optionSource: userSource }),
      numberField('SistCod', 'Sistema', { required: true, optionSource: systemSource }),
      numberField('Modcod', 'Modulo', { required: true, optionSource: moduleSource }),
      numberField('ProgCod', 'Programa', { required: true, optionSource: programSource }),
      textField('ProgUsuC', 'Asignado por', 10, { readOnly: true, width: 140 })
    ]
  },
  asignacionesAcciones: {
    title: 'Acciones por usuario',
    gxObject: 'AsigProg',
    table: 'ASIGPROG1',
    level: 2,
    parentTable: 'ASIGPROG',
    apiName: 'asignacionesAcciones',
    sessionCompanyField: 'GECODEMP',
    disableEdit: true,
    primaryKey: ['GECODEMP', 'UsuLogin', 'SistCod', 'Modcod', 'ProgCod', 'ProgOPCod'],
    filters: [
      { name: 'UsuLogin', label: 'Usuario', required: true, ...userSource },
      { name: 'SistCod', label: 'Sistema', required: true, ...systemSource },
      { name: 'Modcod', label: 'Modulo', required: true, ...moduleSource },
      { name: 'ProgCod', label: 'Programa', required: true, ...programSource }
    ],
    fields: [
      companyField(),
      textField('UsuLogin', 'Usuario', 10, { required: true, optionSource: userSource }),
      numberField('SistCod', 'Sistema', { required: true, optionSource: systemSource }),
      numberField('Modcod', 'Modulo', { required: true, optionSource: moduleSource }),
      numberField('ProgCod', 'Programa', { required: true, optionSource: programSource }),
      numberField('ProgOPCod', 'Accion', { required: true, optionSource: actionSource })
    ]
  }
};
