import { Button, Flex, Image, Stack, Text, Title } from '@mantine/core';
import Baby1 from 'assets/images/Baby1.png';
import React from 'react';
import { useNavigate } from 'react-router';
import Pagination from './pagination';
import styles from './welcome.module.css';
import { Trans, useTranslation } from 'react-i18next';
import { useSettingsContext } from 'service/settings.service';

export default function WelcomeViewFinish() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { onInitialized } = useSettingsContext();

  const next = async () => {
    await onInitialized();
    navigate('/');
  };
  return (
    <>
      <Flex flex="1 1 33%" align={'end'}>
        <Image
          className={styles.image}
          radius="99999px"
          w="50dvw"
          maw="200px"
          src={Baby1}
          h="50dvw"
          mah="200px"
        />
      </Flex>
      <Flex flex="1 0 33%">
        <Stack align="center">
          <Title ff={'Dancing Script'} c="primary" size="3rem">
            {t('welcome-view-finish-title')}
          </Title>
          <Stack gap="lg" align="center">
            <Text ta="center">
              <Trans i18nKey="welcome-view-finish-description" components={{ Nl: <br /> }}></Trans>
            </Text>
            <Button onClick={next}>{t('welcome-view-finish-button-lable')}</Button>
          </Stack>
        </Stack>
      </Flex>
      <Flex flex="1" align="end">
        <Pagination active={4} />
      </Flex>
    </>
  );
}
