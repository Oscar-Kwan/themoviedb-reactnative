import React from 'react';
import { TouchableHighlight, SafeAreaView, Image, FlatList, StyleSheet, Text, View } from 'react-native';
import { AppLoading, Asset, Font, Icon } from 'expo';
import { createStackNavigator, createAppContainer } from 'react-navigation';

class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Pop Movies',
  };

  state = {
    isLoadingComplete: false,
  }

  componentDidMount() {
    return fetch('http://api.themoviedb.org/3/movie/popular?api_key=YOUR_API_KEY')
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          dataSource: responseJson.results
        })
      })
      .catch((error) => {
        console.error(error);
      });
  }

  _onPressImage(value) {
    return fetch(`http://api.themoviedb.org/3/movie/${value.id}?api_key=YOUR_API_KEY`)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          movie: responseJson
        })
        this.props.navigation.navigate('Information', {
          poster_path: responseJson.poster_path,
          original_title: responseJson.original_title,
          release_date: parseInt(responseJson.release_date),
          runtime: responseJson.runtime,
          vote_average: responseJson.vote_average,
          overview: responseJson.overview
        })
      })
      .catch((error) => {
        console.error(error);
      });
  }
  
  _renderItem = ({item, index}) => (
    <TouchableHighlight onPress={() => this._onPressImage(item)}>
      <Image key={index} value={item} source={{uri: `http://image.tmdb.org/t/p/w185/${item.poster_path}`} } 
    style={styles.item} />
    </TouchableHighlight>
  );

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return(
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <SafeAreaView style={styles.container}>
          <View style={styles.flatList}>
            <FlatList
              data={this.state.dataSource}
              numColumns={2}
              renderItem={this._renderItem}
              keyExtractor={({id}, index) => id}
            />
          </View>
        </SafeAreaView>

      );
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
      ]),
      Font.loadAsync({
        ...Icon.Ionicons.font
      }),
    ]);
  };

  _handleLoadingError = error => {
    console.warn(error);
  }

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true })
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    textAlign: 'center',
    width: 288,
    height: 29,
    fontFamily: 'Helvetica',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'left',
    color: '#ffffff'
  },
  flatList:{
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'black',
    flexWrap: 'wrap',
    alignItems: 'flex-start'
  },
  item: {
    height: 279,
    backgroundColor: 'black',
    flex: 1,
    width: 187.5,
  }
});

class InformationScreen extends React.Component {
  static navigationOptions = {
    title: 'MovieDetail',
  };

  render() {
    var { params } = this.props.navigation.state
    if (!params) {
      return(
        <Text>something's missing ...</Text>
      );
    } else {
    return (
      <SafeAreaView style={informationStyles.container}>
        <View style={informationStyles.originalTitleHeader}>
          <Text style={informationStyles.originalTitle}>
          {this.props.navigation.state.params.original_title}
          </Text>
        </View>
        <View style={informationStyles.movieInformation}>
          <Image source={{uri: `http://image.tmdb.org/t/p/w185/${params.poster_path}`} } 
          style={informationStyles.originalPoster} />
          <View style={informationStyles.movieHeader}>
            <Text style={informationStyles.year}>{params.release_date}</Text>
            <Text style={informationStyles.runtime}>{params.runtime} min</Text>
            <Text style={informationStyles.voteAverage}>{params.vote_average}/10</Text>
          </View>
        </View>
        <Text style={informationStyles.overview}>{params.overview}</Text>          
      </SafeAreaView>
    );}
  }
}

const informationStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  year: {
    color: '#747474',
    fontSize: 29,
    fontWeight: '200'
  },
  runtime: {
    marginTop: 4,
    color: '#747474',
    fontSize: 29,
    fontWeight: '300',
    fontStyle:'italic'
  },
  voteAverage: {
    marginTop: 16,
    fontSize: 19
  },
  overview:{
    color: '#747474',
    marginRight: 24,
    marginLeft: 24,
    fontWeight: '100'
  },
  movieInformation: {
    flexDirection: 'row'
  },
  movieHeader: {
    flex: 0.6,
    marginTop: 24
  },
  originalPoster: {
    flex: 0.4,
    margin: 24,
    width: 128,
    height: 190.5
  },
  originalTitle: {
    padding: 24,
    color: 'white',
    fontSize: 38,
    fontWeight: '200'
  },
  originalTitleHeader: {
    justifyContent: 'center',
    backgroundColor: '#009688',
    height: 80.9
  }
});

const MainNavigator = createStackNavigator(
  {
    Home: HomeScreen,
    Information: InformationScreen
  },
  {
    initialRouteName: "Home",
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#212121',
        height: 64,
        borderBottomColor:'#212121'
      },
      headerTitleStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'left',
        fontSize: 29,
        flex: 1,
      },
    }
  }
);

export default createAppContainer(MainNavigator);

