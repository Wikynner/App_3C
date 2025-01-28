import React from 'react';
import { View, Text, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { styles } from '../css/styles';
import { RootStackParamList } from '../../App';
import { RouteProp, NavigationProp } from '@react-navigation/native';

type TelaVisualizarRouteProp = RouteProp<RootStackParamList, 'TelaVisualizar'>;
type TelaVisualizarNavigationProp = NavigationProp<RootStackParamList, 'TelaVisualizar'>;

type Props = {
  route: TelaVisualizarRouteProp;
  navigation: TelaVisualizarNavigationProp;
};

const TelaVisualizar: React.FC<Props> = ({ route, navigation }) => {
  const { dados } = route.params || {};

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {!dados || dados.length === 0 ? (
        <View>
          <Text style={styles.noDataText}>
            Nenhum registro disponível para visualização.
          </Text>
        </View>
      ) : (
        <FlatList
          data={dados}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={styles.dataItem}
              onPress={() =>
                navigation.navigate('TelaDetalhesRegistro', {
                  registro: item,
                })
              }
            >
              <Text style={styles.dataHeader}>Registro {index + 1}</Text>
              <Text style={styles.dataText}>
                <Text style={styles.boldText}>Matrícula: </Text>
                {item.matricula}
              </Text>
              <Text style={styles.dataText}>
                <Text style={styles.boldText}>Patrimônio Implemento: </Text>
                {item.patrimonioImplemento}
              </Text>
              <View style={styles.row}>
                <Text style={styles.dataText}>
                  <Text style={styles.boldText}>Horário Inicial: </Text>
                  {item.horarioInicial || 'Não informado'}
                </Text>
                <Text style={styles.dataText}>
                  <Text style={styles.boldText}>Horário Final: </Text>
                  {item.horarioFinal || 'Não informado'}
                </Text>
              </View>
              <Text style={styles.dataText}>
                <Text style={styles.boldText}>Patrimônio: </Text>
                {item.patrimonio}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}

      <TouchableOpacity
        style={[styles.button, styles.backButton]}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Voltar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default TelaVisualizar;
