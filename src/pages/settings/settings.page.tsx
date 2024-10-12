import { Card, Container, Stack, TextInput, Title } from '@mantine/core';

import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSettingsContext } from 'service/settings.service';

export default function SettingsPage() {
  const { onChangeBabyName } = useSettingsContext();
  const { t } = useTranslation();

  useEffect(() => {}, []);

  const onChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChangeBabyName(event.target.value);
  };

  return (
    <Container fluid h="100%" w="100%">
      <Stack align="start" gap="" h="100%" w="100%">
        <Title order={5}>{t('settings-page-title')}</Title>
        <Card shadow="xs" w="100%">
          <TextInput label={t('settings-page-input-label-name')} onChange={onChangeName} />
        </Card>
      </Stack>
    </Container>
  );
}
