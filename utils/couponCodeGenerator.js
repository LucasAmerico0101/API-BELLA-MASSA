function gerarCodigoCupom(tamanho = 4, prefixo = 'BM-') {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let codigo = '';
  for (let i = 0; i < tamanho; i++) {
    const indice = Math.floor(Math.random() * caracteres.length);
    codigo += caracteres[indice];
  }
  return prefixo + codigo;
}

module.exports = gerarCodigoCupom; 