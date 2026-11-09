import { Text, View, StyleSheet } from 'react-native';
import { RootStackParamList } from '../../App';
import { NavigationProp } from '@react-navigation/native';
import { Produto } from '../types/produto';
import { useEffect, useState } from 'react';
import { getProductById } from '../service/produto-service';
import { colors, radius, shadow } from '../theme';

type Props = NavigationProp<RootStackParamList, 'TelaDetalheProduto'>;

export default function ProductDetailScreen({ route }: Props) {
  const { produtoId } = route.params;
  const [produto, setProduto] = useState<Produto | null>(null);

  useEffect(() => {
    getProductById(produtoId)
      .then((produto) => {
        setProduto(produto);
      })
      .catch((error) => {
        console.error('Erro ao buscar o produto:', error);
        setProduto(null);
      });
  }, [produtoId]);

  if (!produto) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{produto.categoria ?? 'Produto'}</Text>
        </View>
        <Text style={styles.nome}>{produto.nome}</Text>
        <Text style={styles.preco}>R$ {produto.preco.toFixed(2)}</Text>
        <View style={styles.divider} />
        <Text style={styles.label}>Descrição</Text>
        <Text style={styles.descricao}>{produto.descricao}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.background,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.large,
    padding: 22,
    ...shadow,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.background,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 14,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  nome: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.text,
  },
  preco: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.price,
    marginTop: 6,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 18,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  descricao: {
    fontSize: 16,
    color: colors.text,
    marginTop: 8,
    lineHeight: 24,
  },
});
