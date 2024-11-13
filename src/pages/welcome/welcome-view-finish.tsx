import { Button, Flex, Image, Stack, Text, Title } from '@mantine/core';
import Baby1 from 'assets/images/Baby1.png';
import React from 'react';
import { useNavigate } from 'react-router';
import Pagination from './pagination';
import styles from './welcome.module.css';

export default function WelcomeViewFinish() {
  const navigate = useNavigate();

  const next = () => {
    navigate('/');
  };
  return (
    <>
      <Flex flex="1 1 33%" align={'end'}>
        <Image
          className={styles.image}
          radius="99999px"
          w="50dvw"
          maw="200px"
          src={Baby1}
          h="50dvw"
          mah="200px"
        />
      </Flex>
      <Flex flex="1 0 33%">
        <Stack align="center">
          <Title ff={'Dancing Script'} c="primary" size="3rem">
            All done!
          </Title>
          <Stack gap="lg" align="center">
            <Text ta="center">
              You're all set! <br />
              Enjoy exploring the app.
            </Text>
            <Button onClick={next}>Finish</Button>
          </Stack>
        </Stack>
      </Flex>
      <Flex flex="1" align="end">
        <Pagination active={3} />
      </Flex>
    </>
  );
}
