import { Button, Flex, Group, Image, InputLabel, Stack, Switch, Text, Title } from '@mantine/core';
import { IconCircleDashedCheck } from '@tabler/icons-react';
import Breastfeeding3a from 'assets/images/breastfeeding3a.png';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { useSettingsContext } from 'service/settings.service';
import AppRoutes from 'shared/constants/app-routes';
import Pagination from './pagination';
import styles from './welcome.module.css';

export default function WelcomeViewFeeding() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { feedByBoob, feedByBottle, onChangeFeedByBoob, onChangeFeedByBottle, babyName } =
    useSettingsContext();

  const next = () => {
    navigate(AppRoutes.welcomeFinish.absolute);
  };
  return (
    <>
      <Flex flex="1 1 33%" align={'end'}>
        <Image
          className={styles.image}
          radius="99999px"
          w="50dvw"
          maw="200px"
          src={Breastfeeding3a}
          h="50dvw"
          mah="200px"
        />
      </Flex>
      <Flex flex="1 0 33%">
        <Stack align="center">
          <Title ff={'Dancing Script'} c="primary" size="3rem">
            {t('welcome-view-feeding-title')}
          </Title>
          <Stack gap="lg" align="center">
            <Text ta="center">{t('welcome-view-feeding-description', { name: babyName })}</Text>
            <Stack gap="sm">
              <Switch
                label={t('welcome-view-feeding-input-label-breast')}
                checked={feedByBoob}
                onChange={(event) => onChangeFeedByBoob(event.currentTarget.checked)}
              />
              <Switch
                label={t('welcome-view-feeding-input-label-bottle')}
                checked={feedByBottle}
                onChange={(event) => onChangeFeedByBottle(event.currentTarget.checked)}
              />
            </Stack>
            <Button onClick={next}>{t('welcome-view-settings-button-lable')}</Button>
          </Stack>
        </Stack>
      </Flex>
      <Flex flex="1" align="end">
        <Pagination active={2} />
      </Flex>
    </>
  );
}
