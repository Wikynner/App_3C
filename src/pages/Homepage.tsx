import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import { styles } from '../css/styles';
import { RootStackParamList } from '../../App';
import { RouteProp, NavigationProp } from '@react-navigation/native';

type TelaSelecaoFormularioRouteProp = RouteProp<
  RootStackParamList,
  'TelaSelecaoFormulario'
>;
type TelaSelecaoFormularioNavigationProp = NavigationProp<
  RootStackParamList,
  'TelaSelecaoFormulario'
>;

type Props = {
  route: TelaSelecaoFormularioRouteProp;
  navigation: TelaSelecaoFormularioNavigationProp;
};

const TelaSelecaoFormulario: React.FC<Props> = ({ navigation, route }) => {
  const [dados, setDados] = useState<any[]>([]);

  useEffect(() => {
    if (route.params?.dados) {
      setDados(route.params.dados);
    }
  }, [route.params?.dados]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Título interno (vazio para não exibir nada) */}
      <Text style={styles.header}></Text>

      <Image
        source={require('../../assets/img/logo.png')}
        style={{
          width: 400,
          height: 250,
          resizeMode: 'contain',
          alignSelf: 'center',
          marginBottom: 30,
        }}
      />

      <TouchableOpacity
        style={[styles.button, styles.nextButton]}
        onPress={() => {
          navigation.navigate('TelaInformacoesGerais', {
            dados: dados,
          });
        }}
      >
        <Text style={styles.nextButtonText}>Ir para Informações Gerais</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.historyButton]}
        onPress={() => {
          navigation.navigate('TelaVisualizar', {
            dados: dados,
          });
        }}
      >
        <Text style={styles.historyButtonText}>Histórico de Registros</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default TelaSelecaoFormulario;
