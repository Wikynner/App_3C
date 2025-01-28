import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  FlatList,
} from 'react-native';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { styles } from '../css/styles';
import { useFocusEffect, NavigationProp, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';

type TelaCadastroRouteProp = RouteProp<RootStackParamList, 'TelaCadastro'>;
type TelaCadastroNavigationProp = NavigationProp<RootStackParamList, 'TelaCadastro'>;

interface FormData {
  patrimonioImplemento: string;
  operacao: string;
  motivo: string;
  talhao: string;
  cultura: string;
  horaInicial: string | null;
  horaFinal: string | null;
}

type Errors = {
  patrimonioImplemento: boolean;
  operacao: boolean;
  motivo: boolean;
  talhao: boolean;
  horaInicial: boolean;
  horaFinal: boolean;
  horaRange: boolean;
};

type Props = {
  route: TelaCadastroRouteProp;
  navigation: TelaCadastroNavigationProp;
};

const TelaCadastro: React.FC<Props> = ({ navigation, route }) => {
  const [dados, setDados] = useState<any[]>(route.params?.dados || []);
  const informacoesGerais = route.params?.informacoesGerais || {};

  const [formData, setFormData] = useState<FormData>({
    patrimonioImplemento: '',
    operacao: '',
    motivo: '',
    talhao: '',
    cultura: '',
    horaInicial: null,
    horaFinal: null,
  });

  const [showPicker, setShowPicker] = useState({
    horaInicial: false,
    horaFinal: false,
  });

  const [errors, setErrors] = useState<Errors>({
    patrimonioImplemento: false,
    operacao: false,
    motivo: false,
    talhao: false,
    horaInicial: false,
    horaFinal: false,
    horaRange: false,
  });

  useFocusEffect(
    React.useCallback(() => {
      if (route.params?.dados) {
        setDados(route.params.dados);
      }
    }, [route.params?.dados])
  );

  const validateFields = (): boolean => {
    const newErrors: Errors = {
      patrimonioImplemento: false, // não obrigatório
      operacao: !formData.operacao,
      motivo: !formData.motivo,
      talhao: !formData.talhao,
      horaInicial: !formData.horaInicial,
      horaFinal: !formData.horaFinal,
      horaRange: false,
    };

    // Verifica se hora final é menor que a inicial
    if (formData.horaInicial && formData.horaFinal) {
      const ini = new Date(formData.horaInicial);
      const fin = new Date(formData.horaFinal);
      if (fin < ini) {
        newErrors.horaRange = true;
      }
    }

    setErrors(newErrors);

    if (
      newErrors.operacao ||
      newErrors.motivo ||
      newErrors.talhao ||
      newErrors.horaInicial ||
      newErrors.horaFinal ||
      newErrors.horaRange
    ) {
      let msg = '';
      if (newErrors.operacao) msg += '- Operação\n';
      if (newErrors.motivo) msg += '- Motivo\n';
      if (newErrors.talhao) msg += '- Talhão\n';
      if (newErrors.horaInicial) msg += '- Horário Inicial\n';
      if (newErrors.horaFinal) msg += '- Horário Final\n';
      if (newErrors.horaRange) {
        msg += '- Horário Final não pode ser menor que o Inicial\n';
      }
      Alert.alert('Erro', `Corrija os seguintes campos:\n${msg}`);
      return false;
    }

    return true;
  };

  const handleDateChange = (
    event: DateTimePickerEvent,
    selectedDate: Date | undefined,
    field: 'horaInicial' | 'horaFinal'
  ) => {
    setShowPicker({ ...showPicker, [field]: false });
    if (selectedDate) {
      setFormData({ ...formData, [field]: selectedDate.toISOString() });
    }
  };

  const handleAdicionar = () => {
    if (validateFields()) {
      // Combina dados desta tela com as "informacoesGerais" recebidas
      const combinedData = {
        ...informacoesGerais,
        ...formData,
        horarioInicial: formData.horaInicial
          ? new Date(formData.horaInicial).toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit',
            })
          : null,
        horarioFinal: formData.horaFinal
          ? new Date(formData.horaFinal).toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit',
            })
          : null,
      };

      const novosDados = [...dados, combinedData];

      const msgConf = `
Atividade adicionada com sucesso!

Patrimônio Implemento: ${combinedData.patrimonioImplemento}
Operação: ${combinedData.operacao}
Motivo: ${combinedData.motivo}
Talhão: ${combinedData.talhao}
Cultura: ${combinedData.cultura}
Horário Inicial: ${combinedData.horarioInicial}
Horário Final: ${combinedData.horarioFinal}
      `;

      Alert.alert('Sucesso', msgConf, [
        {
          text: 'OK',
          onPress: () => {
            navigation.reset({
              index: 0,
              routes: [
                { name: 'TelaSelecaoFormulario', params: { dados: novosDados } },
              ],
            });
          },
        },
      ]);
    }
  };

  const listaLimite = dados.slice(-3);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Título interno removido */}

      <Text style={styles.label}>Patrimônio Implemento (opcional)</Text>
      <TextInput
        style={[styles.input, errors.patrimonioImplemento && styles.inputError]}
        placeholder="Patrimônio Implemento"
        value={formData.patrimonioImplemento}
        onChangeText={(text) =>
          setFormData({ ...formData, patrimonioImplemento: text })
        }
      />

      <Text style={styles.label}>Operação*</Text>
      <TextInput
        style={[styles.input, errors.operacao && styles.inputError]}
        placeholder="Operação"
        value={formData.operacao}
        onChangeText={(text) => setFormData({ ...formData, operacao: text })}
      />

      <Text style={styles.label}>Motivo de Parada*</Text>
      <TextInput
        style={[styles.input, errors.motivo && styles.inputError]}
        placeholder="Motivo"
        value={formData.motivo}
        onChangeText={(text) => setFormData({ ...formData, motivo: text })}
      />

      <Text style={styles.label}>Talhão*</Text>
      <TextInput
        style={[styles.input, errors.talhao && styles.inputError]}
        placeholder="Talhão"
        value={formData.talhao}
        onChangeText={(text) => setFormData({ ...formData, talhao: text })}
      />

      <Text style={styles.label}>Cultura (opcional)</Text>
      <TextInput
        style={styles.input}
        placeholder="Cultura"
        value={formData.cultura}
        onChangeText={(text) => setFormData({ ...formData, cultura: text })}
      />

      <Text style={styles.label}>Horários*</Text>
      <View style={styles.row}>
        {/* Hora Inicial */}
        <View style={styles.horarioContainer}>
          <Text style={styles.subLabel}>Inicial*</Text>
          <TouchableOpacity
            style={[styles.input, errors.horaInicial && styles.inputError]}
            onPress={() => setShowPicker({ ...showPicker, horaInicial: true })}
          >
            <Text>
              {formData.horaInicial
                ? new Date(formData.horaInicial).toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : 'Selecione'}
            </Text>
          </TouchableOpacity>
          {showPicker.horaInicial && (
            <DateTimePicker
              value={
                formData.horaInicial
                  ? new Date(formData.horaInicial)
                  : new Date()
              }
              mode="time"
              display="default"
              onChange={(event, date) =>
                handleDateChange(event, date, 'horaInicial')
              }
            />
          )}
        </View>

        {/* Hora Final */}
        <View style={styles.horarioContainer}>
          <Text style={styles.subLabel}>Final*</Text>
          <TouchableOpacity
            style={[styles.input, errors.horaFinal && styles.inputError]}
            onPress={() => setShowPicker({ ...showPicker, horaFinal: true })}
          >
            <Text>
              {formData.horaFinal
                ? new Date(formData.horaFinal).toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : 'Selecione'}
            </Text>
          </TouchableOpacity>
          {showPicker.horaFinal && (
            <DateTimePicker
              value={
                formData.horaFinal
                  ? new Date(formData.horaFinal)
                  : new Date()
              }
              mode="time"
              display="default"
              onChange={(event, date) =>
                handleDateChange(event, date, 'horaFinal')
              }
            />
          )}
        </View>
      </View>

      {errors.horaRange && (
        <Text style={styles.errorText}>
          Horário Final não pode ser antes do Horário Inicial.
        </Text>
      )}

      <TouchableOpacity
        style={[styles.button, styles.nextButton]}
        onPress={handleAdicionar}
      >
        <Text style={styles.nextButtonText}>Adicionar</Text>
      </TouchableOpacity>

      <Text style={[styles.header, { marginTop: 20 }]}>Últimos 3 Registros</Text>
      {listaLimite.length > 0 ? (
        <View style={{ maxHeight: 200 }}>
          <FlatList
            data={listaLimite}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.dataItem}>
                <Text style={styles.dataHeader}>Registro #{index + 1}</Text>
                <Text style={styles.dataText}>
                  <Text style={styles.boldText}>Patrimônio Implemento: </Text>
                  {item.patrimonioImplemento || 'Não informado'}
                </Text>
                <Text style={styles.dataText}>
                  <Text style={styles.boldText}>Operação: </Text>
                  {item.operacao || 'Não informado'}
                </Text>
                <Text style={styles.dataText}>
                  <Text style={styles.boldText}>Motivo: </Text>
                  {item.motivo || 'Não informado'}
                </Text>
                <Text style={styles.dataText}>
                  <Text style={styles.boldText}>Talhão: </Text>
                  {item.talhao || 'Não informado'}
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
              </View>
            )}
          />
        </View>
      ) : (
        <Text style={styles.noDataText}>Nenhuma atividade cadastrada.</Text>
      )}
    </ScrollView>
  );
};
export default TelaCadastro;