import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { Card } from 'react-native-elements';


const SECONDS_IN_A_DAY = 86400;
const SECONDS_IN_AN_HOUR = 3600;
const SECONDS_IN_A_MINUTE = 60;

const CountdownTimer = ({ birthDate, lifeExpectancy }) => {
  const [remainingTime, setRemainingTime] = useState(null);

  useEffect(() => {
    const currentDate = new Date();
    const lifeExpectancyDate = new Date(birthDate.getTime() + lifeExpectancy * 365.25 * SECONDS_IN_A_DAY * 1000);
    const remainingTimeInSeconds = Math.floor((lifeExpectancyDate - currentDate) / 1000);
    setRemainingTime(remainingTimeInSeconds);
    const interval = setInterval(() => {
      setRemainingTime((prevRemainingTime) => prevRemainingTime - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [birthDate, lifeExpectancy]);

  const formatTimeUnit = (unit, label) => `${unit} ${label}${unit === 1 ? '' : 's'}`;

  const remainingYears = Math.floor(remainingTime / (SECONDS_IN_A_DAY * 365.25));
  const remainingMonths = Math.floor((remainingTime % (SECONDS_IN_A_DAY * 365.25)) / (SECONDS_IN_A_DAY * 30));
  const remainingDays = Math.floor((remainingTime % (SECONDS_IN_A_DAY * 30)) / SECONDS_IN_A_DAY);
  const remainingHours = Math.floor((remainingTime % SECONDS_IN_A_DAY) / SECONDS_IN_AN_HOUR);
  const remainingMinutes = Math.floor((remainingTime % SECONDS_IN_AN_HOUR) / SECONDS_IN_A_MINUTE);
  const remainingSeconds = remainingTime % SECONDS_IN_A_MINUTE;

  return (
    <View style={{ justifyContent: 'center' }}>
      <Card>
        <Card.Title>Tempo Restante</Card.Title>
        <Card.Divider />
        {remainingTime !== null ? (
          <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>
            {formatTimeUnit(remainingYears, 'ano')}, {formatTimeUnit(remainingMonths, 'mês')},{' '}
            {formatTimeUnit(remainingDays, 'dia')}, {formatTimeUnit(remainingHours, 'hora')},{' '}
            {formatTimeUnit(remainingMinutes, 'minuto')}, {formatTimeUnit(remainingSeconds, 'segundo')}
          </Text>
        ) : (
          <Text>Calculando...</Text>
        )}
        <Text>Outras informações que você julgar útil</Text>
      </Card>
    </View>
  );
};

export default CountdownTimer;
