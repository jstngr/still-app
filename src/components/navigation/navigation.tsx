import { Button, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import React, { ForwardRefExoticComponent, RefAttributes } from 'react';
import styles from './nav-button.module.css';
import { Icon, IconBabyBottle, IconChartBar, IconPoo, IconProps } from '@tabler/icons-react';
import NavButton from './nav-button';
import { useLocation, useMatches, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';

interface INavigationProps {}

export default function Navigation(props: INavigationProps) {
  const { pathname } = useLocation();
  const { t } = useTranslation();

  return (
    <SimpleGrid cols={3} maw="500px" style={{ margin: '0 auto 0 auto' }}>
      <NavButton
        to="poop-tracker"
        active={pathname.includes('poop-tracker')}
        label={t('navigation-button-label-poop-tracker')}
        Icon={IconPoo}
      />
      <NavButton
        to="feed-tracker"
        active={pathname.includes('feed-tracker')}
        label={t('navigation-button-label-feed-tracker')}
        Icon={IconBabyBottle}
      />
      <NavButton
        to="statistics"
        active={pathname.includes('statistics')}
        label={t('navigation-button-label-statistics')}
        Icon={IconChartBar}
      />
    </SimpleGrid>
  );
}
