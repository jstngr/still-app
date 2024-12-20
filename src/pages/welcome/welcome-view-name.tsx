import { Button, Flex, Image, Stack, Text, TextInput, Title } from '@mantine/core';
import Baby2 from 'assets/images/Baby2.webp';
import React from 'react';
import { useNavigate } from 'react-router';
import { useSettingsContext } from 'service/settings.service';
import AppRoutes from 'shared/constants/app-routes';
import Pagination from './pagination';
import styles from './welcome.module.css';
import { useTranslation } from 'react-i18next';

export default function WelcomeViewName() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { onChangeBabyName, babyName } = useSettingsContext();

  const onChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChangeBabyName(event.target.value);
  };
  const next = () => {
    navigate(AppRoutes.welcomeSettings.absolute);
  };
  return (
    <>
      <Flex flex="1 1 33%" align={'end'}>
        <Image
          className={styles.image}
          radius="99999px"
          w="50dvw"
          maw="200px"
          src={Baby2}
          h="50dvw"
          mah="200px"
        />
      </Flex>
      <Flex flex="1 0 33%">
        <Stack align="center">
          <Title ff={'Dancing Script'} c="primary" size="3rem">
            {t('welcome-view-name-title')}
          </Title>
          <Stack gap="lg" align="center">
            <Text ta="center">{t('welcome-view-name-description')}</Text>
            <TextInput onChange={onChangeName} value={babyName} />
            <Button disabled={!babyName} onClick={next}>
              {t('welcome-view-name-button-label')}
            </Button>
          </Stack>
        </Stack>
      </Flex>
      <Flex flex="1" align="end">
        <Pagination active={1} />
      </Flex>
    </>
  );
}
