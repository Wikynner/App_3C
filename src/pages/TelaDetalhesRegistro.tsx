import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { styles } from '../css/styles';
import { RootStackParamList } from '../../App';
import { RouteProp, NavigationProp } from '@react-navigation/native';

type TelaDetalhesRegistroRouteProp = RouteProp<
  RootStackParamList,
  'TelaDetalhesRegistro'
>;
type TelaDetalhesRegistroNavigationProp = NavigationProp<
  RootStackParamList,
  'TelaDetalhesRegistro'
>;

type Props = {
  route: TelaDetalhesRegistroRouteProp;
  navigation: TelaDetalhesRegistroNavigationProp;
};

const TelaDetalhesRegistro: React.FC<Props> = ({ route, navigation }) => {
  const { registro } = route.params || {};

  if (!registro) {
    return (
      <View style={styles.container}>
        <Text style={styles.noDataText}>Nenhum registro selecionado.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Se havia um título interno, removido */}

      <View style={styles.dataItem}>
        <Text style={styles.dataText}>
          <Text style={styles.boldText}>Matrícula: </Text>
          {registro.matricula}
        </Text>
        <Text style={styles.dataText}>
          <Text style={styles.boldText}>Patrimônio Implemento: </Text>
          {registro.patrimonioImplemento}
        </Text>
        <Text style={styles.dataText}>
          <Text style={styles.boldText}>Horário Inicial: </Text>
          {registro.horarioInicial || 'Não informado'}
        </Text>
        <Text style={styles.dataText}>
          <Text style={styles.boldText}>Horário Final: </Text>
          {registro.horarioFinal || 'Não informado'}
        </Text>
        <Text style={styles.dataText}>
          <Text style={styles.boldText}>Patrimônio: </Text>
          {registro.patrimonio}
        </Text>
        <Text style={styles.dataText}>
          <Text style={styles.boldText}>Nome do Coordenador: </Text>
          {registro.nomeCoordenador}
        </Text>
        <Text style={styles.dataText}>
          <Text style={styles.boldText}>Operação: </Text>
          {registro.operacao || 'Não informado'}
        </Text>
        <Text style={styles.dataText}>
          <Text style={styles.boldText}>Motivo: </Text>
          {registro.motivo || 'Não informado'}
        </Text>
        <Text style={styles.dataText}>
          <Text style={styles.boldText}>Talhão: </Text>
          {registro.talhao || 'Não informado'}
        </Text>
        <Text style={styles.dataText}>
          <Text style={styles.boldText}>Cultura: </Text>
          {registro.cultura || 'Não informado'}
        </Text>
        <Text style={styles.dataText}>
          <Text style={styles.boldText}>Horímetro Inicial: </Text>
          {registro.horimetroInicial !== undefined
            ? registro.horimetroInicial
            : 'Não informado'}
        </Text>
        <Text style={styles.dataText}>
          <Text style={styles.boldText}>Horímetro Final: </Text>
          {registro.horimetroFinal !== undefined
            ? registro.horimetroFinal
            : 'Não informado'}
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.button, styles.backButton]}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Voltar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default TelaDetalhesRegistro;
