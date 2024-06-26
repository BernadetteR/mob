import React, { useState } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { Searchbar } from 'react-native-paper';

const DATA = [
  { id: '1', title: 'Baked salmon with fennel & tomatoes' },
  { id: '2', title: 'Cajun spiced fish tacos' },
  { id: '3', title: 'Escovitch Fish' },
  { id: '4', title: 'Fish fofos' },
  { id: '5', title: 'Fish pie' },
  // Weitere Einträge...
];

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState(DATA);

  const onChangeSearch = query => {
    setSearchQuery(query);
    if (query) {
      setFilteredData(
          DATA.filter(item =>
              item.title.toLowerCase().includes(query.toLowerCase())
          )
      );
    } else {
      setFilteredData(DATA);
    }
  };

  const renderItem = ({ item }) => (
      <View style={styles.item}>
        <Text style={styles.title}>{item.title}</Text>
      </View>
  );

  return (
      <View style={styles.container}>
        <Searchbar
            placeholder="Search"
            onChangeText={onChangeSearch}
            value={searchQuery}
        />
        <FlatList
            data={filteredData}
            renderItem={renderItem}
            keyExtractor={item => item.id}
        />
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
    paddingHorizontal: 20,
  },
  item: {
    padding: 10,
    marginVertical: 8,
    backgroundColor: '#f9c2ff',
  },
  title: {
    fontSize: 18,
  },
});

export default App;
