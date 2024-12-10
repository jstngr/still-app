import { SimpleGrid } from '@mantine/core';
import React from 'react';
import { IconChartBar, IconDroplet, IconPoo, IconZzz } from '@tabler/icons-react';
import NavButton from './nav-button';
import { useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useSettingsContext } from 'service/settings.service';

export default function Navigation() {
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const settings = useSettingsContext();

  const tabsAmount = [true, settings.poopTrackerEnabled, settings.sleepTrackerEnabled, true].filter(
    (entry) => entry,
  )?.length;

  return (
    <SimpleGrid cols={tabsAmount} maw="500px" m="0 auto 0 auto" px="20px">
      <NavButton
        to="feeding"
        active={pathname.includes('feed')}
        label={t('navigation-button-label-feed-tracker')}
        Icon={IconDroplet}
      />
      {settings.poopTrackerEnabled && (
        <NavButton
          to="poop"
          active={pathname.includes('poop')}
          label={t('navigation-button-label-poop-tracker')}
          Icon={IconPoo}
        />
      )}
      {settings.sleepTrackerEnabled && (
        <NavButton
          to="sleep"
          active={pathname.includes('sleep')}
          label={t('navigation-button-label-sleep-tracker')}
          Icon={IconZzz}
        />
      )}
      <NavButton
        to="statistics"
        active={pathname.includes('statistics')}
        label={t('navigation-button-label-statistics')}
        Icon={IconChartBar}
      />
    </SimpleGrid>
  );
}
