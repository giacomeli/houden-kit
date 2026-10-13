# Changesets

Cada mudança publicada do houden-kit leva um changeset: um arquivo Markdown nesta pasta com o tipo da versão (`patch`, `minor` ou `major`) e a descrição que vai para o `CHANGELOG.md`.

```bash
npm run changeset
```

Na `main`, o workflow de release abre um PR de versão com os changesets acumulados. Ao mesclar esse PR, ele publica no npm por trusted publishing.

Convenção da 0.x:

| Tipo | Quando |
| --- | --- |
| `patch` | Correção de defeito herdado do app de origem (um por changeset, ver `PORTING.md`) ou de bug |
| `minor` | Componente novo, prop nova ou mudança de markup |
| `major` | Reservado para a 1.0.0 |
