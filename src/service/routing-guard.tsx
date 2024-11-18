import { SplashScreen } from '@capacitor/splash-screen';
import React, { ReactNode, useEffect } from 'react';
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
  const { pathname } = useLocation();

  useEffect(() => {
    if (!settingsLoaded) return;

    window.setTimeout(() => {
      SplashScreen.hide();
    }, 400);

    if (!initialized && !pathname.includes(AppRoutes.welcome.absolute)) {
      navigate(AppRoutes.welcome.absolute);
    }

    if (initialized && !pathname.includes(AppRoutes.app.absolute)) {
      navigate(AppRoutes.app.absolute);
    }
  }, [settingsLoaded, initialized, pathname]);

  return <>{children}</>;
}
