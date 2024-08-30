import { Button, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import React, { ForwardRefExoticComponent, RefAttributes } from 'react';
import styles from './nav-button.module.css';
import { Icon, IconBabyBottle, IconChartBar, IconPoo, IconProps } from '@tabler/icons-react';
import NavButton from './nav-button';

interface INavigationProps {}

export default function Navigation(props: INavigationProps) {
  return (
    <SimpleGrid cols={3} maw="500px" style={{ margin: '0 auto 0 auto' }}>
      <NavButton active={false} label="Poop tracker" Icon={IconPoo} />
      <NavButton active={true} label="Feed tracker" Icon={IconBabyBottle} />
      <NavButton active={false} label="Statistics" Icon={IconChartBar} />
    </SimpleGrid>
  );
}
