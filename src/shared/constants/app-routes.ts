const AppRoutes = {
  app: { absolute: '/app', relative: 'app/*' },
  feeding: { absolute: '/app/feeding', relative: 'feeding' },
  poop: { absolute: '/app/poop', relative: 'poop' },
  statistics: { absolute: '/app/statistics', relative: 'statistics' },
  sleep: { absolute: '/app/sleep', relative: 'sleep' },
  settings: { absolute: '/app/settings', relative: 'settings' },

  welcome: { absolute: '/welcome', relative: 'welcome/*' },
  welcomeName: { absolute: '/welcome/name', relative: 'name' },
  welcomeSettings: { absolute: '/welcome/settings', relative: 'settings' },
  welcomeFeeding: { absolute: '/welcome/feeding', relative: 'feeding' },
  welcomeFinish: { absolute: '/welcome/finish', relative: 'finish' },
};

export default AppRoutes;
