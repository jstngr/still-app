import {
  Alert,
  Button,
  Card,
  Container,
  Divider,
  Flex,
  Group,
  Modal,
  NumberInput,
  ScrollArea,
  Select,
  Stack,
  Switch,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconAlertTriangle, IconDropletHalfFilled, IconRuler2 } from '@tabler/icons-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useFeedingContext } from 'service/feeding.service';
import { usePoopContext } from 'service/poop.service';
import { useSettingsContext } from 'service/settings.service';
import { useSleepContext } from 'service/sleep.service';
import { TLanguage } from 'translations/react-i18next';

const valueToNumber = (value: string | number) => {
  if (!value) return 0;
  if (typeof value === 'string') return parseInt(value, 10);
  return value;
};

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
    feedByBoob,
    feedByBottle,
    onChangeFeedByBoob,
    onChangeFeedByBottle,
    feedingUnit,
    onChangeFeedingUnit,
    defaultVolume,
    onChangeDefaultVolume,
  } = useSettingsContext();
  const { deleteHistory: deleteFeedingHistory } = useFeedingContext();
  const { deleteHistory: deletePoopHistory } = usePoopContext();
  const { deleteHistory: deleteSleepHistory } = useSleepContext();
  const { t } = useTranslation();

  const [resetWarningOpen, { open: openResetWarning, close: closeResetWarning }] =
    useDisclosure(false);

  const onChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChangeBabyName(event.target.value);
  };

  const onChangeUnit = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChangeFeedingUnit(event.target.value);
  };

  const onChangeVolume = (value: number | string | '') => {
    const actualValue = valueToNumber(value);
    onChangeDefaultVolume(actualValue);
  };

  const onDeleteHistory = async () => {
    await deleteFeedingHistory();
    await deletePoopHistory();
    await deleteSettings();
    await deleteSleepHistory();
  };
  return (
    <ScrollArea>
      <Container fluid w="100%" h="calc(100% - 76px)" pb="8px">
        <Stack gap="lg" align="start" h="100%" w="100%">
          <Title order={5}>{t('settings-page-title')}</Title>
          <Stack w="100%">
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
                { value: 'es', label: t('language_not_translated_es') },
                { value: 'ru', label: t('language_not_translated_ru') },
                { value: 'uk', label: t('language_not_translated_uk') },
                { value: 'pl', label: t('language_not_translated_pl') },
                { value: 'fr', label: t('language_not_translated_fr') },
                { value: 'nl', label: t('language_not_translated_nl') },
                { value: 'pt', label: t('language_not_translated_pt') },
                { value: 'tr', label: t('language_not_translated_tr') },
                { value: 'zh', label: t('language_not_translated_zh') },
                { value: 'ja', label: t('language_not_translated_ja') },
              ]}
              label={t('settings-page-input-label-language')}
              placeholder="Pick value"
              value={language}
              aria-autocomplete="none"
              onChange={(_value, option) => onChangeLanguage(option.value as TLanguage)}
            />
            <Divider />
            <Text ta="left" size="sm">
              {t('settings-page-feeding-description', { name: babyName })}
            </Text>
            <Stack gap="sm">
              <Switch
                label={t('settings-page-input-label-breast')}
                checked={feedByBoob}
                onChange={(event) => onChangeFeedByBoob(event.currentTarget.checked)}
              />
              <Switch
                label={t('settings-page-input-label-bottle')}
                checked={feedByBottle}
                onChange={(event) => onChangeFeedByBottle(event.currentTarget.checked)}
              />
              <Card withBorder bg="none">
                <Stack>
                  <TextInput
                    label={t('settings-page-input-label-unit')}
                    onChange={onChangeUnit}
                    value={feedingUnit}
                    disabled={!feedByBottle}
                    maxLength={5}
                    leftSection={<IconRuler2 stroke="1" />}
                  />
                  <NumberInput
                    leftSection={<IconDropletHalfFilled stroke="1" />}
                    label={t('settings-page-input-label-default-volume', {
                      suffix: feedingUnit,
                    })}
                    value={defaultVolume}
                    onChange={onChangeVolume}
                    suffix={` ${feedingUnit}`}
                    allowNegative={false}
                    allowDecimal={false}
                    hideControls
                    max={5000}
                    disabled={!feedByBottle}
                  />
                </Stack>
              </Card>
            </Stack>
          </Stack>

          <Divider w="100%" />

          <Text size="sm">{t('settings-page-card-title-app-functions')}</Text>
          <Stack gap="sm">
            <Switch
              label={t('settings-page-switch-label-diaper-tracker')}
              checked={poopTrackerEnabled}
              onChange={(event) => onChangePoopTrackerEnabled(event.currentTarget.checked)}
            />
            <Switch
              label={t('settings-page-switch-label-sleep-tracker')}
              checked={sleepTrackerEnabled}
              onChange={(event) => onChangeSleepTrackerEnabled(event.currentTarget.checked)}
            />
          </Stack>

          <Alert
            variant="light"
            title={`${t('settings-page-alert-title-reset')}`}
            icon={<IconAlertTriangle />}
            w="100%"
          >
            <Stack gap="xs">
              <Text size="sm">{t('settings-page-warning-text-reset')}</Text>
              <Flex justify="end">
                <Button onClick={openResetWarning}>{t('settings-page-button-label-reset')}</Button>
              </Flex>
            </Stack>
          </Alert>
        </Stack>
      </Container>
      <Modal
        opened={resetWarningOpen}
        onClose={closeResetWarning}
        centered
        title={t('settings-page-modal-title-reset')}
        autoFocus={false}
      >
        <Stack>
          <Divider />
          <Text>{t('settings-page-modal-text')}</Text>
          <Divider />
          <Group justify="end">
            <Button variant="outline" onClick={closeResetWarning}>
              {t('settings-page-modal-title-cancel')}
            </Button>
            <Button data-autofocus onClick={onDeleteHistory}>
              {t('settings-page-modal-title-confirm')}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </ScrollArea>
  );
}
