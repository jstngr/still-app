import {
  Button,
  Flex,
  Image,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import React from 'react';
import BreastFeeding2 from 'assets/images/breastfeeding2.jpg';
import styles from './welcome.module.css';
import { useNavigate } from 'react-router';
import AppRoutes from 'shared/constants/app-routes';
import Pagination from './pagination';
import { Trans, useTranslation } from 'react-i18next';

export default function WelcomeViewWelcome() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const next = () => {
    navigate(AppRoutes.welcomeName.absolute);
  };
  return (
    <>
      <Flex flex="1 1 33%" align={'end'}>
        <Image
          className={styles.image}
          radius="99999px"
          w="50dvw"
          maw="200px"
          src={BreastFeeding2}
          h="50dvw"
          mah="200px"
        />
      </Flex>
      <Flex flex="1 0 33%">
        <Stack align="center">
          <Title ff={'Dancing Script'} c="primary" size="3rem">
            {t('welcome-view-welcome-title')}
          </Title>
          <Stack gap="lg" align="center">
            <Text ta="center">
              <Trans
                i18nKey="welcome-view-welcome-description"
                components={{
                  Nl: <br />,
                }}
              />
            </Text>
            <Button onClick={next}>{t('welcome-view-welcome-button-label')}</Button>
          </Stack>
        </Stack>
      </Flex>
      <Flex flex="1" align="end">
        <Pagination active={0} />
      </Flex>
    </>
  );
}
