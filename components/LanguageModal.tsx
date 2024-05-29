import { LanguageContext } from '@/contexts/LanguageContext';
import useFetch from '@/hooks/useFetch';
import React, { useContext } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface LanguageModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectLanguage: (language: string) => void;
}

interface HeaderData {
  data: {
    id: number,
    attributes: {
      languages: [
        {
          id: number,
          language: string,
          denUrl: string,
          flag: {
            data: {
              attributes: {
                url: string
              }
            }
          }
        }
      ],
      languageModalTitle: string
    }
  }
}

const LanguageModal: React.FC<LanguageModalProps> = ({ visible, onClose, onSelectLanguage }) => {

  const languageContext = useContext(LanguageContext);
  const locale = languageContext?.locale;

  const contactsDataApiUrl = `http://172.20.10.3:1337/api/header?locale=${locale}&populate[0]=languages&populate[1]=languages.flag`;
  const { loading: loadingData, error: errorData, data: headerData } = useFetch<HeaderData>(contactsDataApiUrl);


  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>{headerData?.data.attributes.languageModalTitle}</Text>
          {headerData?.data.attributes.languages.map((language) => {
            return (
              <TouchableOpacity key={language.id} onPress={() => { onSelectLanguage(language.denUrl) }} style={locale === language.denUrl ? styles.selectedLanguageOption : styles.languageOption}>
                <View style={styles.optionContainer}>
                  <Image source={{ uri: `http://172.20.10.3:1337${language.flag.data.attributes.url}`}} style={styles.flagImage}/>
                  <Text style={styles.languageText}>{language.language}</Text>
                  {locale === language.denUrl ? <MaterialIcons name="done" size={20} color="black" style={styles.selectedIcon} /> : ''}
                </View>
              </TouchableOpacity>
            )
          })}
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    backgroundColor: '#f0ddcb',
    borderRadius: 30,
    padding: 20,
    alignItems: 'flex-start',
  },
  modalTitle: {
    width: '100%',
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
    marginBottom: 20,
    textAlign: 'center',
  },
  languageOption: {
    padding: 10,
    marginVertical: 5,
  },
  languageText: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular'
  },
  closeButton: {
    marginTop: 20,
    padding: 7,
    backgroundColor: '#49516c',
    borderRadius: 30,
    alignSelf: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    paddingHorizontal: 5,
    fontFamily: 'Poppins_400Regular'
  },
  flagImage: {
    width: 30,
    height: 30,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'gray',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginRight: 10
  },
  optionContainer: {
    flexDirection: 'row',
    width: '100%',
  },
  selectedLanguageOption: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#d3b8a6',
    fontWeight: 'bold',
    padding: 10,
    borderRadius: 20
  },
  selectedIcon: {
    alignSelf: 'center',
    marginLeft: 90
  }
});

export default LanguageModal;
