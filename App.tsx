import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import TelaSelecaoFormulario from './src/pages/Homepage';
import TelaInformacoesGerais from './src/pages/RegisterInformacoesGerais';
import TelaCadastro from './src/pages/TelaCadastro';
import TelaVisualizar from './src/pages/TelaVisualizacao';
import TelaDetalhesRegistro from './src/pages/TelaDetalhesRegistro';

/**
 * Define aqui as rotas e os tipos de parâmetros de cada tela.
 */
export type RootStackParamList = {
  TelaSelecaoFormulario: { dados?: any[] } | undefined;
  TelaInformacoesGerais: { dados?: any[] };
  TelaCadastro: { dados?: any[]; informacoesGerais?: any } | undefined;
  TelaVisualizar: { dados?: any[] } | undefined;
  TelaDetalhesRegistro: { registro?: any } | undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App(): JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="TelaSelecaoFormulario"
        screenOptions={{
          headerStyle: { backgroundColor: 'green' },
          headerTintColor: '#fff',
        }}
      >
        <Stack.Screen
          name="TelaSelecaoFormulario"
          component={TelaSelecaoFormulario}
          options={{ title: 'BDO' }}
        />
        <Stack.Screen
          name="TelaInformacoesGerais"
          component={TelaInformacoesGerais}
          options={{ title: 'BDO' }}
        />
        <Stack.Screen
          name="TelaCadastro"
          component={TelaCadastro}
          options={{ title: 'Cadastro de Atividades' }}
        />
        <Stack.Screen
          name="TelaVisualizar"
          component={TelaVisualizar}
          options={{ title: 'Histórico de Registros' }}
        />
        <Stack.Screen
          name="TelaDetalhesRegistro"
          component={TelaDetalhesRegistro}
          options={{ title: 'Detalhes do Registro' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
