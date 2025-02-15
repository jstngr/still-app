import { Button, Flex, Image, Stack, Text, Title } from '@mantine/core';
import Baby4 from 'assets/images/Baby4.webp';
import React from 'react';
import { useNavigate } from 'react-router';
import Pagination from './pagination';
import styles from './welcome.module.css';
import { Trans, useTranslation } from 'react-i18next';

export default function WelcomeViewPrivacy() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const next = async () => {
    //   await showConsentForms();
    //   navigate(AppRoutes.welcomeFinish.absolute);
  };

  return (
    <>
      <Flex flex="1 1 33%" align={'end'}>
        <Image
          className={styles.image}
          radius="99999px"
          w="50dvw"
          maw="200px"
          src={Baby4}
          h="50dvw"
          mah="200px"
        />
      </Flex>
      <Flex flex="1 0 33%">
        <Stack align="center">
          <Title ff={'Dancing Script'} c="primary" size="3rem">
            {t('welcome-view-privacy-title')}
          </Title>
          <Stack gap="lg" align="center">
            <Text ta="center">
              <Trans i18nKey="welcome-view-policy-description" components={{ Nl: <br /> }}></Trans>
            </Text>
            <Button onClick={next}>{t('welcome-view-privacy-button-lable')}</Button>
          </Stack>
        </Stack>
      </Flex>
      <Flex flex="1" align="end">
        <Pagination active={4} />
      </Flex>
    </>
  );
}
