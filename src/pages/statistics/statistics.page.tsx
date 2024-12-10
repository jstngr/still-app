import { Carousel, Embla } from '@mantine/carousel';
import { Button, FloatingIndicator, Group, Stack } from '@mantine/core';

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './statistics-page.module.css';
import Last24Hours from './components/last-24-hours';
import LastWeek from './components/last-week';

export default function StatisticsPage() {
  const { t } = useTranslation();
  const [embla, setEmbla] = useState<Embla | null>(null);

  useEffect(() => {
    if (embla) {
      embla.on('select', () => {
        setValue(embla.selectedScrollSnap().toString());
      });
    }
  }, [embla]);

  const [rootRef, setRootRef] = useState<HTMLDivElement | null>(null);
  const [value, setValue] = useState<string | null>('0');
  const [controlsRefs, setControlsRefs] = useState<Record<string, HTMLButtonElement | null>>({});
  const setControlRef = (val: string) => (node: HTMLButtonElement) => {
    controlsRefs[val] = node;
    setControlsRefs(controlsRefs);
  };

  return (
    <Stack gap="xs" style={{ overflowY: 'hidden' }}>
      <Group ref={setRootRef} pos="relative" justify="center">
        <Button
          onClick={() => {
            embla?.scrollPrev();
          }}
          variant="subtle"
          w="42vw"
          maw="200px"
          ref={setControlRef('0')}
          className={styles.tabButton}
          px="xs"
        >
          {t('statistics-page-tab-24-hours')}
        </Button>
        <Button
          onClick={() => {
            embla?.scrollNext();
          }}
          variant="subtle"
          w="42vw"
          maw="200px"
          ref={setControlRef('1')}
          className={styles.tabButton}
          px="xs"
        >
          {t('statistics-page-tab-7-days')}
        </Button>
        <FloatingIndicator
          target={value ? controlsRefs[value] : null}
          parent={rootRef}
          className={styles.indicator}
          transitionDuration={600}
        />
      </Group>

      <Carousel
        getEmblaApi={setEmbla}
        withControls={false}
        classNames={{
          root: styles.carouselRoot,
          viewport: styles.carouselViewport,
          container: styles.carouselContainer,
        }}
      >
        <Carousel.Slide key="0" pt="xxs">
          <LastWeek />
        </Carousel.Slide>
        <Carousel.Slide key="1" pt="xxs">
          <Last24Hours />
        </Carousel.Slide>
      </Carousel>
    </Stack>
  );
}
