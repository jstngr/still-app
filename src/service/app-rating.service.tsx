import { createContext, ReactNode, useContext, useEffect, useRef } from 'react';
import React from 'react';
import { useFeedingContext } from './feeding.service';
import Baby5 from 'assets/images/Baby5.webp';
import { InAppReview } from '@capacitor-community/in-app-review';
import { Button, Center, Divider, Group, Image, Modal, Stack, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Trans, useTranslation } from 'react-i18next';
import { useSettingsContext } from './settings.service';

interface IAppRatingProviderProps {
  children: ReactNode;
}

interface IAppRatingContextType {
  triggerRating: () => Promise<void>;
}

const AppRatingContext = createContext<IAppRatingContextType | undefined>(undefined);

export const AppRatingProvider: React.FC<IAppRatingProviderProps> = ({ children }) => {
  const { feedingEntries } = useFeedingContext();
  const { onAppRated, appRated } = useSettingsContext();
  const [isModalOpen, { open, close }] = useDisclosure();
  const { t } = useTranslation();

  const checkRating = async () => {
    close();
    InAppReview.requestReview();
    onAppRated();
  };

  const timer = useRef<number>();

  const triggerRating = async () => {
    if (appRated) return;

    timer.current = window.setTimeout(() => {
      if (
        feedingEntries?.length &&
        (feedingEntries?.length % 80 == 0 || feedingEntries?.length === 15)
      ) {
        open();
      }
    }, 2000);
  };

  useEffect(() => {
    if (timer?.current) {
      window.clearTimeout(timer.current);
    }
  }, []);

  return (
    <AppRatingContext.Provider value={{ triggerRating }}>
      {children}
      <Modal opened={isModalOpen} onClose={close} centered title={t('app-rating-modal-title')}>
        <Stack>
          <Center>
            <Image radius="99999px" w="80%" maw="150px" src={Baby5} h="80%" mah="150px" />
          </Center>
          <Text>
            <Trans
              i18nKey="app-rating-modal-description"
              components={{
                Nl: <br />,
              }}
            />
          </Text>
          <Divider />
          <Group justify="end">
            <Button variant="outline" onClick={close}>
              {t('app-rating-modal-button-action-2')}
            </Button>
            <Button data-autofocus onClick={checkRating}>
              {t('app-rating-modal-button-action-1')}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </AppRatingContext.Provider>
  );
};

export const useAppRatingContext = () => {
  const context = useContext(AppRatingContext);
  if (context === undefined) {
    throw new Error('useAppRatingContext must be used within a AppRatingProvider');
  }
  return context;
};
