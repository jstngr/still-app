import { Card, Container, Flex, Group, ScrollArea, Stack, Text, Title } from '@mantine/core';
import BoobButton from 'components/boob-button';
import KpiCard from 'components/kpi-card';
import React from 'react';
import scrollStyles from './scroll-area.module.css';

export default function FeedTracker(props) {
  return (
    <Container fluid h="100%">
      <Stack align="center" gap="xl" h="100%">
        <Group grow gap="lg">
          <BoobButton color="primary" label="Left" orientation="left" />
          <BoobButton color="primary" variant="outline" label="Right" orientation="right" active />
        </Group>

        <Flex>
          <Text>
            Feeding since{' '}
            <strong>
              2:20<small>Min</small>
            </strong>
          </Text>
        </Flex>

        <ScrollArea w={'calc(100% + 10px)'} classNames={scrollStyles}>
          <Group wrap="nowrap" py="xxs" px="5px">
            <KpiCard amount={5} title="x feed" text="in the last 24 hours" />
            <KpiCard amount={5} title="x feed" text="in the last 24 hours" />
            <KpiCard amount={5} title="x feed" text="in the last 24 hours" />
            <KpiCard amount={5} title="x feed" text="in the last 24 hours" />
          </Group>
        </ScrollArea>

        <Stack flex="1 0 0" w="100%">
          <Title order={5}>Feeding History</Title>
          <ScrollArea
            type="always"
            flex={'1 0 0'}
            w={'calc(100% + 10px)'}
            classNames={scrollStyles}
          >
            <Stack p="2px 20px 4px 0px" gap="xs">
              <Card shadow="xs">Blubba blubb</Card>
              <Card shadow="xs">Blubba blubb</Card>
              <Card shadow="xs">Blubba blubb</Card>
              <Card shadow="xs">Blubba blubb</Card>
              <Card shadow="xs">Blubba blubb</Card>
              <Card shadow="xs">Blubba blubb</Card>
              <Card shadow="xs">Blubba blubb</Card>
              <Card shadow="xs">Blubba blubb</Card>
              <Card shadow="xs">Blubba blubb</Card>
            </Stack>
          </ScrollArea>
        </Stack>
      </Stack>
    </Container>
  );
}
