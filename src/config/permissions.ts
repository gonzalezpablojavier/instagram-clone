export enum Route {
  Home = '/home',
  PermisoTemporal = '/permiso-temporal',
  HowAreYou = '/how-are-you',
  PanelPermisosTemporales = '/PanelPermisosTemporales',
  PanelAdminVacaciones = '/PanelAdminVacaciones',
  ManageMoods = '/ManageMoods',
  Registro = '/registro',
  Presentismo = '/presentismo',
  Vacaciones = '/Vacaciones',
  Login = '/login',
  Unauthorized = '/unauthorized'
}

export const ADMIN_IDS = ['0', '2', '8'];
export const MANAGER_IDS = ['4', '7', '8'];

export const ROUTE_PERMISSIONS: { [key in Route]: string[] } = {
  [Route.Home]: ['all'],
  [Route.PermisoTemporal]: ['all'],
  [Route.HowAreYou]: ['all'],
  [Route.PanelPermisosTemporales]: [...ADMIN_IDS, ...MANAGER_IDS],
  [Route.PanelAdminVacaciones]: [...ADMIN_IDS, ...MANAGER_IDS],  
  [Route.ManageMoods]: ADMIN_IDS,
  [Route.Registro]: ['all'],
  [Route.Presentismo]: ['all'],
  [Route.Vacaciones]: ['all'],
  [Route.Login]: ['all'],
  [Route.Unauthorized]: ['all']
};

export const hasPermission = (colaboradorID: string, route: Route): boolean => {
  const permissions = ROUTE_PERMISSIONS[route];
  return permissions.includes('all') || permissions.includes(colaboradorID);
};