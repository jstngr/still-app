import { Button, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import React, { ForwardRefExoticComponent, RefAttributes } from 'react';
import styles from './nav-button.module.css';
import {
  Icon,
  IconBabyBottle,
  IconBed,
  IconBedFlat,
  IconChartBar,
  IconPoo,
  IconProps,
} from '@tabler/icons-react';
import NavButton from './nav-button';
import { useLocation, useMatches, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useSettingsContext } from 'service/settings.service';

export default function Navigation() {
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const settings = useSettingsContext();

  const tabsAmount = [true, settings.poopTrackerEnabled, settings.sleepTrackerEnabled, true].filter(
    (entry) => entry
  )?.length;

  return (
    <SimpleGrid cols={tabsAmount} maw="500px" m="0 auto 0 auto" px="20px">
      <NavButton
        to="feed"
        active={pathname.includes('feed')}
        label={t('navigation-button-label-feed-tracker')}
        Icon={IconBabyBottle}
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
          Icon={IconBedFlat}
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
