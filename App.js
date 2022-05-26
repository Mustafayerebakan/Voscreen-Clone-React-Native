import { Image,View, Text, Alert, StyleSheet, TouchableOpacity , LogBox} from 'react-native'
import React, { useState,useEffect,useRef } from 'react'
import firestore from '@react-native-firebase/firestore';
import Video from 'react-native-video';
import BottomSheet from "react-native-gesture-bottom-sheet";

LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs();

export default function App() {


  const [username, setUsername] = useState([]);
  const [trigger, setTrigger] = useState(1);

  const [button1, setButton1] = useState("");
  const [button2, setButton2] = useState("");

  const [butonRand, setbutonRand] = useState("");

  const [butonRenk, setrenkBir] = useState("skyblue");
  const [butonRenkIki, setrenkIki] = useState("skyblue");

  const bottomSheet = useRef();
  const close = async () =>{
    await bottomSheet.current.close()
   }

  const result = useRef();
  const resultClose = () =>{result.current.close()}

  const buttonPres = async () =>{

    if(butonRand == "girdi1"){
      await setrenkBir("green");
      await setrenkIki("red");
    }
    if(butonRand == "girdi2"){
      await setrenkBir("red");
      await setrenkIki("green");
    }
    setTimeout(() => {
      close();
      setTrigger(trigger+1);
    }, 1500);
   
  }

  const tekrarOynat = async() =>{

    const temp = await username;
    setUsername([]);
    setUsername(temp);
    bottomSheet.current.close() 

  }

  useEffect(() => {

    setUsername([]);
    var maxNumber;
    setrenkBir("skyblue");
    setrenkIki("skyblue");

    
    const sayi = async () => {
      var temp = 0;
      const userss = await firestore().collection('videos').get();
      const doc = userss.docs;
      doc.forEach(element => {
        temp=temp+1;
      });
    
       maxNumber = temp;
       console.log(maxNumber);
       return maxNumber;
    }
    
    const request = async () => {

    
      await sayi();
      var randomNumber = await Math.floor((Math.random() * maxNumber) + 1);
      const users = await firestore().collection('videos').doc('video'+randomNumber).get();
      setUsername(users.data());
      var randomButton =  Math.floor((Math.random() * 2) + 1);
      switch(randomButton) 
        {
          case 1:
             setbutonRand("girdi1");
             setButton1(users.data().true);
             setButton2(users.data().false);
            break;
          case 2:
            setbutonRand("girdi2");
             setButton1(users.data().false);
             setButton2(users.data().true);
            break; 
        }
    }
    request();
  }, [trigger]);

  return (

    <View style={{flex:1}}>
        <Video  source={{uri: username.link}}                                              
          style={{flex:1}}
          resizeMode={"cover"}
          onEnd={() => bottomSheet.current.show()}
           />

        <BottomSheet  draggable={false} ref={bottomSheet} height={180}>
          <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
            <View style={{flexDirection:'row',flex:1,justifyContent: 'center',alignItems: 'center',width:'85%'}}>
              <Text>{username.filmAdi}</Text>
              <TouchableOpacity onPress={()=>tekrarOynat()} style={{height:'80%',width:'30%',justifyContent: 'center',alignItems: 'center'}}>
                <Text style={{color:'steelblue',fontSize:15}}>Tekrar Oynat</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={()=>buttonPres()} style={[styles.button,{backgroundColor:butonRenk}]}>
                <Text style={{color:'steelblue',fontSize:20}}>{button1}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>buttonPres()} style={[styles.button2,{backgroundColor:butonRenkIki}]}>
                <Text style={{color:'steelblue',fontSize:20}}>{button2}</Text>
            </TouchableOpacity>
          </View>
        </BottomSheet>
    </View>
  )
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  }, 
  tinyLogo: {
    
    width: 50,
    height: 50,
  },
  button:{
    margin:5,
    alignItems:'center',
    justifyContent:'center',
    flex:1,
    flexDirection:"row",
    width:"80%" ,
    height: "30%", 
    marginTop: 10 ,
    backgroundColor:"skyblue",
    borderRadius:5,
  },
  button2:{
    margin:5,
    alignItems:'center',
    justifyContent:'center',
    flex:1,
    flexDirection:"row",
    width:"80%" ,
    height: "30%", 
    marginTop: 10 ,
    backgroundColor:"skyblue",
    borderRadius:5,
  },
});
