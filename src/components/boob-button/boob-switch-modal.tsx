import { Button, Divider, Group, Modal, Stack, Text } from '@mantine/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useFeedingContext } from 'service/feeding.service';

export default function BoobSwitchModal() {
  const { t } = useTranslation();
  const { boobSwitchModal, switchBoob } = useFeedingContext();
  const { boobSwitchModalOpened, closeBoobSwitchModal } = boobSwitchModal;

  const onConfirm = () => {
    switchBoob();
    closeBoobSwitchModal();
  };

  return (
    <Modal
      opened={boobSwitchModalOpened}
      onClose={closeBoobSwitchModal}
      centered
      title={t('boob-switch-modal-title')}
      autoFocus={false}
    >
      <Stack>
        <Divider />
        <Text>{t('boob-switch-modal-text')}</Text>
        <Divider />
        <Group justify="end">
          <Button variant="outline" onClick={closeBoobSwitchModal}>
            {t('boob-switch-modal-button-action-2')}
          </Button>
          <Button data-autofocus onClick={onConfirm}>
            {t('boob-switch-modal-button-action-1')}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
