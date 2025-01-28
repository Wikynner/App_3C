import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';

import { styles } from '../css/styles';
import { useFocusEffect, NavigationProp, RouteProp } from '@react-navigation/native';

/**
 * Defina seu tipo de rotas principais aqui, incluindo as telas
 * que precisam de parâmetros. Isso é só um exemplo simplificado.
 */
type RootStackParamList = {
  TelaInformacoesGerais: {
    dados?: any[];
  };
  TelaCadastro: {
    dados?: any[];
    informacoesGerais?: FormDataType;
  };
  // Outras telas...
};

/**
 * Tipo dos dados do formulário nesta tela.
 * (Ajuste os tipos conforme suas necessidades.)
 */
type FormDataType = {
  matricula: string;
  nomeCoordenador: string;
  patrimonio: string;
  horarioInicial: string | null; // armazenando Data em formato ISO ou null
  horarioFinal: string | null;
  horimetroInicial: string; // armazenado como string para o TextInput
  horimetroFinal: string;
};

/**
 * Tipo para controlar a exibição do DatePicker
 */
type PickerVisibility = {
  horarioInicial: boolean;
  horarioFinal: boolean;
};

/**
 * Tipo para controlar quais campos estão com erro
 */
type ErrorsType = {
  matricula: boolean;
  nomeCoordenador: boolean;
  patrimonio: boolean;
  horarioInicial: boolean;
  horarioFinal: boolean;
  horimetroInicial: boolean;
  horimetroFinal: boolean;
};

/**
 * Extraindo do RootStackParamList o tipo para route e navigation.
 */
type TelaInformacoesGeraisRouteProp = RouteProp<
  RootStackParamList,
  'TelaInformacoesGerais'
>;
type TelaInformacoesGeraisNavigationProp = NavigationProp<
  RootStackParamList,
  'TelaInformacoesGerais'
>;

/**
 * Props do componente: route + navigation
 */
type Props = {
  route: TelaInformacoesGeraisRouteProp;
  navigation: TelaInformacoesGeraisNavigationProp;
};

const TelaInformacoesGerais: React.FC<Props> = ({ navigation, route }) => {
  // Estado do formulário
  const [formData, setFormData] = useState<FormDataType>({
    matricula: '',
    nomeCoordenador: '',
    patrimonio: '',
    horarioInicial: null,
    horarioFinal: null,
    horimetroInicial: '',
    horimetroFinal: '',
  });

  // Estado que armazena os dados já existentes (caso venham de outra tela)
  const [dados, setDados] = useState<any[]>(route.params?.dados || []);

  // Controla visibilidade dos pickers (Hora inicial/final)
  const [showPicker, setShowPicker] = useState<PickerVisibility>({
    horarioInicial: false,
    horarioFinal: false,
  });

  // Estado de erros
  const [errors, setErrors] = useState<ErrorsType>({
    matricula: false,
    nomeCoordenador: false,
    patrimonio: false,
    horarioInicial: false,
    horarioFinal: false,
    horimetroInicial: false,
    horimetroFinal: false,
  });

  // Atualiza "dados" caso venha algo novo via route.params
  useFocusEffect(
    React.useCallback(() => {
      if (route.params?.dados) {
        setDados(route.params.dados);
      }
    }, [route.params?.dados])
  );

  const Register = () => {
    try {

    } catch (error) {
      
    }
  }

  const validateFields = (): boolean => {
    const newErrors: ErrorsType = {
      matricula: !formData.matricula,
      nomeCoordenador: !formData.nomeCoordenador,
      patrimonio: !formData.patrimonio,
      horarioInicial: !formData.horarioInicial,
      horarioFinal: !formData.horarioFinal,
      horimetroInicial: isNaN(parseFloat(formData.horimetroInicial)),
      horimetroFinal: isNaN(parseFloat(formData.horimetroFinal)),
    };

    if (formData.horarioInicial && formData.horarioFinal) {
      const ini = new Date(formData.horarioInicial);
      const fin = new Date(formData.horarioFinal);
      if (fin < ini) {
        newErrors.horarioFinal = true;
      }
    }
    const hIni = parseFloat(formData.horimetroInicial);
    const hFin = parseFloat(formData.horimetroFinal);
    if (!isNaN(hIni) && !isNaN(hFin)) {
      if (hFin <= hIni) {
        newErrors.horimetroFinal = true;
      }
      if (hFin === 0) {
        newErrors.horimetroFinal = true;
      }
    }

    setErrors(newErrors);

    if (Object.values(newErrors).includes(true)) {
      let errMsg = '';
      if (newErrors.matricula) errMsg += '- Matrícula\n';
      if (newErrors.nomeCoordenador) errMsg += '- Nome do Coordenador\n';
      if (newErrors.patrimonio) errMsg += '- Patrimônio\n';
      if (newErrors.horarioInicial) errMsg += '- Horário Inicial\n';
      if (newErrors.horarioFinal) {
        errMsg += '- Horário Final (verifique se não é menor que o Inicial)\n';
      }
      if (newErrors.horimetroInicial) {
        errMsg += '- Horímetro Inicial (valor inválido)\n';
      }
      if (newErrors.horimetroFinal) {
        errMsg += '- Horímetro Final (verifique se não é menor/igual ao Inicial ou zero)\n';
      }
      Alert.alert('Erro', `Corrija os seguintes campos:\n${errMsg}`);
      return false;
    }

    // Caso contrário, está tudo certo
    return true;
  };

  /**
   * Lida com a mudança de data/hora do DateTimePicker
   */
  const handleDateChange = (
    event: DateTimePickerEvent,
    selectedDate: Date | undefined,
    field: 'horarioInicial' | 'horarioFinal'
  ) => {
    setShowPicker((prev) => ({ ...prev, [field]: false }));
    if (selectedDate) {
      setFormData((prev) => ({
        ...prev,
        [field]: selectedDate.toISOString(),
      }));
    }
  };

  /**
   * Botão Avançar -> valida e, se ok, navega para a próxima tela (TelaCadastro)
   */
  const handleAvancar = () => {
    if (validateFields()) {
      navigation.navigate('TelaCadastro', {
        dados,
        informacoesGerais: formData,
      });
    }
  };

  const listaLimite = dados.slice(-3);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/*
        Se antes havia um <Text style={styles.header}>Cadastro de Atividades</Text>,
        e você quer remover qualquer título interno, basta não colocar nada aqui.
      */}

      {/* Matrícula */}
      <Text style={styles.label}>Matrícula*</Text>
      <TextInput
        style={[styles.input, errors.matricula && styles.inputError]}
        placeholder="Digite a Matrícula"
        keyboardType="numeric"
        value={formData.matricula}
        onChangeText={(text) =>
          setFormData((prev) => ({ ...prev, matricula: text }))
        }
      />
      {errors.matricula && (
        <Text style={styles.errorText}>Matrícula é obrigatória.</Text>
      )}

      {/* Nome do Coordenador */}
      <Text style={styles.label}>Nome do Coordenador*</Text>
      <TextInput
        style={[styles.input, errors.nomeCoordenador && styles.inputError]}
        placeholder="Coordenador"
        value={formData.nomeCoordenador}
        onChangeText={(text) =>
          setFormData((prev) => ({ ...prev, nomeCoordenador: text }))
        }
      />
      {errors.nomeCoordenador && (
        <Text style={styles.errorText}>
          Nome do Coordenador é obrigatório.
        </Text>
      )}

      {/* Patrimônio */}
      <Text style={styles.label}>Patrimônio*</Text>
      <TextInput
        style={[styles.input, errors.patrimonio && styles.inputError]}
        placeholder="Digite o Patrimônio"
        keyboardType="numeric"
        value={formData.patrimonio}
        onChangeText={(text) =>
          setFormData((prev) => ({ ...prev, patrimonio: text }))
        }
      />
      {errors.patrimonio && (
        <Text style={styles.errorText}>Patrimônio é obrigatório.</Text>
      )}

      {/* Horários */}
      <Text style={styles.label}>Horários*</Text>
      <View style={styles.row}>
        <View style={styles.horarioContainer}>
          <Text style={styles.subLabel}>Inicial*</Text>
          <TouchableOpacity
            style={[styles.input, errors.horarioInicial && styles.inputError]}
            onPress={() =>
              setShowPicker((prev) => ({ ...prev, horarioInicial: true }))
            }
          >
            <Text>
              {formData.horarioInicial
                ? new Date(formData.horarioInicial).toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : 'Selecione'}
            </Text>
          </TouchableOpacity>
          {showPicker.horarioInicial && (
            <DateTimePicker
              value={
                formData.horarioInicial
                  ? new Date(formData.horarioInicial)
                  : new Date()
              }
              mode="time"
              display="default"
              onChange={(e, d) => handleDateChange(e, d, 'horarioInicial')}
            />
          )}
          {errors.horarioInicial && (
            <Text style={styles.errorText}>Obrigatório.</Text>
          )}
        </View>

        <View style={styles.horarioContainer}>
          <Text style={styles.subLabel}>Final*</Text>
          <TouchableOpacity
            style={[styles.input, errors.horarioFinal && styles.inputError]}
            onPress={() =>
              setShowPicker((prev) => ({ ...prev, horarioFinal: true }))
            }
          >
            <Text>
              {formData.horarioFinal
                ? new Date(formData.horarioFinal).toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : 'Selecione'}
            </Text>
          </TouchableOpacity>
          {showPicker.horarioFinal && (
            <DateTimePicker
              value={
                formData.horarioFinal
                  ? new Date(formData.horarioFinal)
                  : new Date()
              }
              mode="time"
              display="default"
              onChange={(e, d) => handleDateChange(e, d, 'horarioFinal')}
            />
          )}
          {errors.horarioFinal && (
            <Text style={styles.errorText}>Obrigatório.</Text>
          )}
        </View>
      </View>

      {/* Horímetro */}
      <Text style={styles.label}>Horímetro</Text>
      <View style={styles.row}>
        <View style={styles.horimetroContainer}>
          <Text style={styles.subLabel}>Inicial</Text>
          <TextInput
            style={[styles.input, errors.horimetroInicial && styles.inputError]}
            placeholder="Horímetro Inicial"
            keyboardType="numeric"
            value={formData.horimetroInicial}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, horimetroInicial: text }))
            }
          />
          {errors.horimetroInicial && (
            <Text style={styles.errorText}>Valor inválido.</Text>
          )}
        </View>
        <View style={styles.horimetroContainer}>
          <Text style={styles.subLabel}>Final</Text>
          <TextInput
            style={[styles.input, errors.horimetroFinal && styles.inputError]}
            placeholder="Horímetro Final"
            keyboardType="numeric"
            value={formData.horimetroFinal}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, horimetroFinal: text }))
            }
          />
          {errors.horimetroFinal && (
            <Text style={styles.errorText}>Valor inválido.</Text>
          )}
        </View>
      </View>

      {/* Botão Avançar */}
      <TouchableOpacity
        style={[styles.button, styles.nextButton]}
        onPress={handleAvancar}
      >
        <Text style={styles.nextButtonText}>Avançar</Text>
      </TouchableOpacity>

      {/* Exemplo de exibir últimos 3 registros */}
      <Text style={[styles.header, { marginTop: 20 }]}>Últimos 3 Registros</Text>
      {listaLimite.length > 0 ? (
        <View style={{ maxHeight: 200 }}>
          <FlatList
            data={listaLimite}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.dataItem}>
                <Text style={styles.dataHeader}>Registro #{index + 1}</Text>
                <Text style={styles.dataText}>
                  <Text style={styles.boldText}>Matrícula: </Text>
                  {item.matricula}
                </Text>
                <Text style={styles.dataText}>
                  <Text style={styles.boldText}>Coordenador: </Text>
                  {item.nomeCoordenador}
                </Text>
                <Text style={styles.dataText}>
                  <Text style={styles.boldText}>Patrimônio: </Text>
                  {item.patrimonio}
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
                <View style={styles.row}>
                  <Text style={styles.dataText}>
                    <Text style={styles.boldText}>Horímetro Inicial: </Text>
                    {item.horimetroInicial ?? 'Não informado'}
                  </Text>
                  <Text style={styles.dataText}>
                    <Text style={styles.boldText}>Horímetro Final: </Text>
                    {item.horimetroFinal ?? 'Não informado'}
                  </Text>
                </View>
              </View>
            )}
          />
        </View>
      ) : (
        <Text style={styles.noDataText}>Nenhum registro encontrado.</Text>
      )}
    </ScrollView>
  );
};

export default TelaInformacoesGerais;
