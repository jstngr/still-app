import {
  Alert,
  Button,
  Card,
  Container,
  Flex,
  ScrollArea,
  Select,
  Stack,
  Switch,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons-react';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFeedingContext } from 'service/feeding.service';
import { usePoopContext } from 'service/poop.service';
import { useSettingsContext } from 'service/settings.service';
import { TLanguage } from 'translations/react-i18next';

export default function SettingsPage() {
  const {
    sleepTrackerEnabled,
    poopTrackerEnabled,
    onChangeBabyName,
    language,
    onChangeLanguage,
    deleteSettings,
    babyName,
    onChangeSleepTrackerEnabled,
    onChangePoopTrackerEnabled,
  } = useSettingsContext();
  const { deleteHistory: deleteFeedingHistory } = useFeedingContext();
  const { deleteHistory: deletePoopHistory } = usePoopContext();
  const { t } = useTranslation();

  useEffect(() => {}, []);

  const onChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChangeBabyName(event.target.value);
  };

  const onDeleteHistory = async () => {
    await deleteFeedingHistory();
    await deletePoopHistory();
    await deleteSettings();
  };
  return (
    <ScrollArea>
      <Container fluid w="100%" h="calc(100% - 76px)" pb="8px">
        <Stack align="start" h="100%" w="100%">
          <Title order={5}>{t('settings-page-title')}</Title>
          <Card shadow="xs" w="100%">
            <Stack>
              <Title order={5}>{t('settings-page-card-title-misc')}</Title>
              <TextInput
                label={t('settings-page-input-label-name')}
                onChange={onChangeName}
                value={babyName}
              />
              <Select
                allowDeselect={false}
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
            <Stack>
              <Title order={5}>{t('settings-page-card-title-app-functions')}</Title>
              <Stack gap="sm">
                <Switch
                  label="Show poop tracker"
                  checked={poopTrackerEnabled}
                  onChange={(event) => onChangePoopTrackerEnabled(event.currentTarget.checked)}
                />
                <Switch
                  label="Show sleep tracker"
                  checked={sleepTrackerEnabled}
                  onChange={(event) => onChangeSleepTrackerEnabled(event.currentTarget.checked)}
                />
              </Stack>
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
                  <Button onClick={onDeleteHistory}>{t('settings-page-button-label-reset')}</Button>
                </Flex>
              </Stack>
            </Alert>
          </Card>
        </Stack>
      </Container>
    </ScrollArea>
  );
}
