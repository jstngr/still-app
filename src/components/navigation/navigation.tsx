import { Button, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import React, { ForwardRefExoticComponent, RefAttributes } from 'react';
import styles from './nav-button.module.css';
import { Icon, IconBabyBottle, IconChartBar, IconPoo, IconProps } from '@tabler/icons-react';
import NavButton from './nav-button';
import { useLocation, useMatches, useNavigate } from 'react-router';

interface INavigationProps {}

export default function Navigation(props: INavigationProps) {
  const { pathname } = useLocation();

  return (
    <SimpleGrid cols={3} maw="500px" style={{ margin: '0 auto 0 auto' }}>
      <NavButton
        to="poop-tracker"
        active={pathname.includes('poop-tracker')}
        label="Poop tracker"
        Icon={IconPoo}
      />
      <NavButton
        to="feed-tracker"
        active={pathname.includes('feed-tracker')}
        label="Feed tracker"
        Icon={IconBabyBottle}
      />
      <NavButton
        to="statistics"
        active={pathname.includes('statistics')}
        label="Statistics"
        Icon={IconChartBar}
      />
    </SimpleGrid>
  );
}
