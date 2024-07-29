import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Button,
  Image,
  Dimensions,
} from 'react-native';
import {useWebSocket} from '../contexts/WebSocketContext';

const {width, height} = Dimensions.get('window'); // 화면의 너비와 높이를 가져옴

const LibraryScreen = ({navigation}) => {
  const [selectedStory, setSelectedStory] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const {socket, stories} = useWebSocket();

  const handleStoryPress = story => {
    setSelectedStory(story);
    setModalVisible(true);
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleStoryPress(item)}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.author}>{item.author}</Text>
      {item.protagonists && item.protagonists.length > 0 && (
        <Image
          source={{uri: item.protagonists[0].image}}
          style={styles.protagonistImage}
        />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={stories}
        renderItem={renderItem}
        keyExtractor={item => item._id.toString()}
        contentContainerStyle={styles.list}
        horizontal // 가로 스크롤 활성화
        showsHorizontalScrollIndicator={false} // 가로 스크롤바 숨김
      />
      {selectedStory && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedStory.title}</Text>
              <Text style={styles.modalAuthor}>
                Author: {selectedStory.author}
              </Text>
              <Text style={styles.modalText}>
                Publication Status: {selectedStory.publication_status}
              </Text>
              <Text style={styles.modalText}>
                Question Depth: {selectedStory.question_depth}
              </Text>
              <Text style={styles.modalText}>
                Question Count: {selectedStory.question_count}
              </Text>
              <Text style={styles.modalText}>
                Question Extension Enabled:{' '}
                {selectedStory.question_extension_enabled ? 'Yes' : 'No'}
              </Text>
              {selectedStory.protagonists &&
                selectedStory.protagonists.map(protagonist => (
                  <View
                    key={protagonist._id}
                    style={styles.protagonistContainer}>
                    <Image
                      source={{uri: protagonist.image}}
                      style={styles.protagonistImageLarge}
                    />
                    <Text style={styles.modalText}>
                      Description: {protagonist.description}
                    </Text>
                  </View>
                ))}
              <Button title="Close" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </Modal>
      )}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('BookCreation')}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingVertical: 20,
  },
  list: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  card: {
    width: width * 0.2, // 카드 너비를 화면 너비의 80%로 설정
    height: height * 0.6, // 카드 높이를 화면 높이의 60%로 설정
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 10,
    marginHorizontal: 10,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  author: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  protagonistImage: {
    width: 120,
    height: 120,
    marginTop: 15,
    borderRadius: 60,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 15,
  },
  modalAuthor: {
    fontSize: 18,
    marginBottom: 15,
    color: '#555',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#444',
  },
  protagonistContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  protagonistImageLarge: {
    width: 150,
    height: 150,
    marginBottom: 10,
    borderRadius: 75,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#FF6347',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
  fabText: {
    fontSize: 24,
    color: 'white',
  },
});

export default LibraryScreen;
