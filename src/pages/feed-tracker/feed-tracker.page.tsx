import {
  Badge,
  Button,
  Card,
  Container,
  Divider,
  Group,
  ScrollArea,
  Stack,
  Title,
} from '@mantine/core';
import { IconArrowBadgeLeft, IconSignLeft } from '@tabler/icons-react';
import BoobButton from 'components/boob-button';
import React from 'react';
import scrollStyles from './scroll-area.module.css';

export default function FeedTracker(props) {
  return (
    <Container fluid>
      <Stack align="center" gap="xl">
        <Badge
          size="lg"
          variant="gradient"
          gradient={{ from: 'primary', to: 'secondary', deg: 90 }}
        >
          5:45 Min Feeding Left
        </Badge>
        <Group grow gap="lg">
          <BoobButton color="primary" label="Left" orientation="left" />
          <BoobButton color="secondary" label="Right" orientation="right" active />
        </Group>
        <Divider size="sm" w="100%" />

        <ScrollArea w={'100%'} classNames={scrollStyles} py={'xxs'}>
          <Group wrap="nowrap">
            <Card shadow="xs" w="100px">
              Blaaa
            </Card>
            <Card shadow="xs" w="100px">
              Blaaa
            </Card>
            <Card shadow="xs" w="100px">
              Blaaa
            </Card>
            <Card shadow="xs" w="100px">
              Blaaa
            </Card>
          </Group>
        </ScrollArea>
        <Divider size="sm" w="100%" />
        <div></div>
      </Stack>
    </Container>
  );
}
