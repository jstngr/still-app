import { SplashScreen } from '@capacitor/splash-screen';
import React, { ReactNode, createContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import AppRoutes from 'shared/constants/app-routes';
import { useSettingsContext } from './settings.service';

interface IRoutingGuardProps {
  children: ReactNode;
}

/**
 * This provider acts as router to navigate the user to
 * the welcome screen if the settings are not initialized yet.
 * Hides the splash screen on route.
 *
 * @param param0
 * @returns
 */
export default function RoutingGuard({ children }: IRoutingGuardProps) {
  const { settingsLoaded, initialized } = useSettingsContext();
  const navigate = useNavigate();
  const { pathname, key } = useLocation();

  useEffect(() => {
    if (!settingsLoaded) return;
    SplashScreen.hide();

    if (initialized && !pathname.includes(AppRoutes.app.absolute)) {
      navigate(AppRoutes.app.absolute);
    } else if (!pathname.includes(AppRoutes.welcome.absolute)) {
      navigate(AppRoutes.welcome.absolute);
    }
  }, [settingsLoaded, initialized, pathname]);

  return <>{children}</>;
}
