import { NavigationProp } from '@react-navigation/native';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, FlatList, TextInput, View, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Produto, ProdutoRequest } from '../types/produto';
import { getProducts, createProduct, isLastPage } from '../service/produto-service';
import { RootStackParamList } from '../../App';
import { colors, radius, shadow } from '../theme';

type Props = NavigationProp<RootStackParamList, 'TelaListaProdutos'>;

const FAVORITES_KEY = '@compre-bem:favoritos';

export default function ProductListScreen({ navigation }: Props) {

    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [pagina, setPagina] = useState(0);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');
    const [busca, setBusca] = useState('');
    const [ultima, setUltima] = useState(false);

    const [descricao, setDescricao] = useState('');
    const [nome, setNome] = useState('');
    const [preco, setPreco] = useState('');
    const [quantidade, setQuantidade] = useState('');

    const [favoritos, setFavoritos] = useState([]);

    const loadingMore = useRef(false);

    function loadFirstPage() {
        setCarregando(true);
        getProducts(0, busca).then((resposta) => {
            setProdutos(resposta.content);
            setPagina(0);
            setUltima(isLastPage(resposta));
        })
        .catch((erro) => {
            setErro('Erro ao carregar produtos: ' + erro.message);
        })
        .finally(() => {
            setCarregando(false);
        });
    }

    useEffect(() => {
        loadFirstPage();
    }, [busca]);

    async function loadMoreProducts() {
        if (loadingMore.current || ultima || carregando) {
            return;
        }

        loadingMore.current = true;
        const nextPage = pagina + 1;

        try {
            const resposta = await getProducts(nextPage, busca);
            setProdutos((atual) => [...atual, ...resposta.content]);
            setPagina(nextPage);
            setUltima(isLastPage(resposta));
        } catch (error) {
            setErro('Erro ao carregar mais produtos: ' + error.message);
        } finally {
            loadingMore.current = false;
        }
    }

    useEffect(() => {
        AsyncStorage.getItem(FAVORITES_KEY).then(valor => {
            if (valor) {
                setFavoritos(JSON.parse(valor));
            }
        });
    }, []);

    function validateAndSaveProduct() {
        if (validateProduct(nome, preco)) {
            const novoProduto: ProdutoRequest = {
                nome: nome,
                preco: parseFloat(preco),
                descricao: descricao,
                quantidade: parseFloat(quantidade)
            };

            createProduct(novoProduto)
                .then((produto) => {
                    setProdutos((atual) => [produto, ...atual]);
                    setNome('');
                    setPreco('');
                    setDescricao('');
                    setQuantidade('');
                    setErro('');
                })
                .catch((erro) => {
                    setErro('Erro ao salvar produto: ' + erro.message);
                });
        }
    }

    function validateProduct(nome: string, preco: string): boolean {
        if (!nome || !preco) {
            setErro('Por favor, preencha todos os campos.');
            return false;
        }

        if (isNaN(parseFloat(preco.replace(',', '.')))) {
            setErro('Por favor, informe um preço válido.');
            return false;
        }

        return true;
    }

    function toggleFavorite(id: string) {
        setFavoritos((atual) => {
            const novo = atual.includes(id) ? atual.filter(favId => favId !== id) : [...atual, id];
            AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(novo));
            return novo;
        });
    }

    return (
        <SafeAreaView style={styles.area} edges={['left', 'right']}>
            <KeyboardAvoidingView style={styles.area}>
                <FlatList
                    data={produtos}
                    keyExtractor={(item) => item.produtoId}
                    onEndReached={loadMoreProducts}
                    onEndReachedThreshold={0.8}
                    contentContainerStyle={styles.listContent}
                    keyboardShouldPersistTaps="handled"
                    ListHeaderComponent={
                        <View>
                            <View style={styles.cadastro}>
                                <Text style={styles.sectionTitle}>Novo produto</Text>

                                <TextInput
                                    style={styles.input}
                                    placeholder="Nome do produto"
                                    placeholderTextColor={colors.textMuted}
                                    value={nome}
                                    onChangeText={setNome}
                                    returnKeyType='next'
                                />

                                <View style={styles.row}>
                                    <TextInput
                                        style={[styles.input, styles.rowItem]}
                                        placeholder="Preço"
                                        placeholderTextColor={colors.textMuted}
                                        value={preco}
                                        onChangeText={setPreco}
                                        keyboardType='numeric'
                                        returnKeyType='next'
                                    />
                                    <TextInput
                                        style={[styles.input, styles.rowItem]}
                                        placeholder="Quantidade"
                                        placeholderTextColor={colors.textMuted}
                                        value={quantidade}
                                        onChangeText={setQuantidade}
                                        keyboardType='numeric'
                                        returnKeyType='next'
                                    />
                                </View>

                                <TextInput
                                    style={[styles.input, styles.inputMultiline]}
                                    placeholder="Descrição do produto"
                                    placeholderTextColor={colors.textMuted}
                                    value={descricao}
                                    multiline={true}
                                    numberOfLines={4}
                                    onChangeText={setDescricao}
                                    returnKeyType='done'
                                />

                                {erro ? (
                                    <View style={styles.erroBox}>
                                        <Text style={styles.erroTexto}>{erro}</Text>
                                    </View>
                                ) : null}

                                <TouchableOpacity
                                    style={styles.botao}
                                    onPress={validateAndSaveProduct}>
                                    <Text style={styles.botaoTexto}>Adicionar produto</Text>
                                </TouchableOpacity>
                            </View>

                            <TextInput
                                style={styles.buscar}
                                placeholder="Buscar produtos..."
                                placeholderTextColor={colors.textMuted}
                                value={busca}
                                onChangeText={setBusca}
                            />
                        </View>
                    }
                    renderItem={({ item }) => (
                        <View style={styles.item}>
                            <TouchableOpacity
                                style={styles.itemInfo}
                                onPress={() => navigation.navigate('TelaDetalheProduto', { produtoId: item.produtoId })}>
                                <Text style={styles.nome} numberOfLines={1}>{item.nome}</Text>
                                <Text style={styles.preco}>R$ {item.preco}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.botaoFavorito}
                                onPress={() => toggleFavorite(item.produtoId)}>
                                <Text style={styles.favoritoTexto}>
                                    {favoritos.includes(item.produtoId) ? '♥' : '♡'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )} />
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    area: {
        flex: 1,
        backgroundColor: colors.background,
    },
    listContent: {
        paddingBottom: 24,
    },
    cadastro: {
        margin: 16,
        marginBottom: 8,
        padding: 16,
        gap: 10,
        backgroundColor: colors.surface,
        borderRadius: radius.large,
        ...shadow,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: colors.primaryDark,
        marginBottom: 2,
    },
    row: {
        flexDirection: 'row',
        gap: 10,
    },
    rowItem: {
        flex: 1,
    },
    input: {
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.small,
        backgroundColor: colors.background,
        color: colors.text,
        fontSize: 15,
    },
    inputMultiline: {
        minHeight: 84,
        textAlignVertical: 'top',
    },
    erroBox: {
        backgroundColor: colors.dangerBackground,
        borderRadius: radius.small,
        padding: 10,
    },
    erroTexto: {
        color: colors.danger,
        fontSize: 14,
        fontWeight: '600',
    },
    botao: {
        backgroundColor: colors.primary,
        borderRadius: radius.medium,
        paddingVertical: 14,
        alignItems: 'center',
    },
    botaoTexto: {
        color: colors.onPrimary,
        fontSize: 16,
        fontWeight: '700',
    },
    buscar: {
        marginHorizontal: 16,
        marginTop: 8,
        marginBottom: 10,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 999,
        backgroundColor: colors.surface,
        color: colors.text,
        fontSize: 15,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        marginBottom: 10,
        backgroundColor: colors.surface,
        borderRadius: radius.medium,
        borderLeftWidth: 5,
        borderLeftColor: colors.primary,
        ...shadow,
    },
    itemInfo: {
        flex: 1,
        paddingVertical: 16,
        paddingHorizontal: 16,
    },
    nome: {
        fontSize: 17,
        fontWeight: '700',
        color: colors.text,
    },
    preco: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.price,
        marginTop: 4,
    },
    botaoFavorito: {
        minWidth: 48,
        minHeight: 48,
        alignItems: 'center',
        justifyContent: 'center',
    },
    favoritoTexto: {
        fontSize: 24,
        color: colors.favorite,
    },
});
