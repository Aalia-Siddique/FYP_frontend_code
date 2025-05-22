import React from 'react';
import { Button, View } from 'react-native';
import { useLanguage } from './LanguageContext';

const LanguageSwitcher = () => {
  const { setLang } = useLanguage();

  return (
    <View style={{ margin: 20 }}>
      <Button title="اردو میں کریں" onPress={() => setLang('ur')} />
    </View>
  );
};

export default LanguageSwitcher;
