import {
  Alert,
  Button,
  Card,
  Container,
  Flex,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons-react';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSettingsContext } from 'service/settings.service';
import { TLanguage } from 'translations/react-i18next';

export default function SettingsPage() {
  const { onChangeBabyName, language, onChangeLanguage } = useSettingsContext();
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
          <Stack>
            <TextInput label={t('settings-page-input-label-name')} onChange={onChangeName} />
            <Select
              checkIconPosition="left"
              data={[
                { value: 'de', label: t('language_not_translated_de') },
                { value: 'en', label: t('language_not_translated_en') },
              ]}
              label={t('settings-page-input-label-language')}
              placeholder="Pick value"
              value={language}
              aria-autocomplete="none"
              onChange={(_value, option) => onChangeLanguage(option.value as TLanguage)}
            />
          </Stack>
        </Card>
        <Card shadow="xs" w="100%">
          <Alert
            variant="light"
            title={`${t('settings-page-alert-title-reset')}`}
            icon={<IconAlertTriangle />}
          >
            <Stack gap="xs">
              <Text size="sm">{t('settings-page-warning-text-reset')}</Text>
              <Flex justify="end">
                <Button>{t('settings-page-button-label-reset')}</Button>
              </Flex>
            </Stack>
          </Alert>
        </Card>
      </Stack>
    </Container>
  );
}
