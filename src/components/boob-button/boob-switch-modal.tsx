import { Button, Divider, Group, Modal, Stack, Text } from '@mantine/core';
import React from 'react';
import { useFeedingContext } from 'service/feeding.service';

export default function BoobSwitchModal() {
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
      title="Change Boob?"
      autoFocus={false}
    >
      <Stack>
        <Divider />
        <Text>This will start a new Timer.</Text>
        <Divider />
        <Group justify="end">
          <Button variant="outline" onClick={closeBoobSwitchModal}>
            Cancel
          </Button>
          <Button data-autofocus onClick={onConfirm}>
            Change Boob
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
