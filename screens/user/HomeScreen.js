import {
  StyleSheet,
  StatusBar,
  View,
  TouchableOpacity,
  Text,
  Image,
  FlatList,
  RefreshControl,
  ScrollView,
  Modal,
  Pressable,
  SafeAreaView,
  Button,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import cartIcon from "../../assets/icons/cart_beg.png";
import easybuylogo from "../../assets/logo/logo.png";
import { colors } from "../../constants";
import CustomIconButton from "../../components/CustomIconButton/CustomIconButton";
import ProductCard from "../../components/ProductCard/ProductCard";
import { network } from "../../constants";
import { useSelector, useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreaters from "../../states/actionCreaters/actionCreaters";
import SearchableDropdown from "react-native-searchable-dropdown";
import { SliderBox } from "react-native-image-slider-box";
import BannerCodeScanner from "./BannerCodeScanner";
import { WebView } from "react-native-webview";
import { Alert, Box, Switch } from "native-base";
import axios from "axios";
const category = [
  {
    _id: "6485572cdb3b9bfb1429fb89",
    title: "Nước giải khát",
    image: require("../../assets/icons/men.png"),
  },
  {
    _id: "6417d212f4a14efc88c07fdd",
    title: "Women",
    image: require("../../assets/icons/women.png"),
  },
  {
    _id: "6417d21af4a14efc88c07fe0",
    title: "Kids",
  },
];

const slides = [
  require("../../assets/image/banners/banner.png"),
  require("../../assets/image/banners/banner.png"),
];

const HomeScreen = ({ navigation, route }) => {
  const cartproduct = useSelector((state) => state.product);
  const dispatch = useDispatch();

  const { addCartItem } = bindActionCreators(actionCreaters, dispatch);

  const { user } = route.params;
  const [products, setProducts] = useState([]);
  const [refeshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [userInfo, setUserInfo] = useState({});
  const [searchItems, setSearchItems] = useState([]);
  const [dataSearch, setDataSearch] = useState([]);
  const [scannedData, setScannedData] = useState("");
  const [autoSearch, setAutoSearch] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [modalVisiblee, setModalVisiblee] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState("Pending");
  const [payment, setPayment] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(false);
  const [userPayment, setuserPayment] = useState(false);
  const convertToJSON = (obj) => {
    try {
      setUserInfo(JSON.parse(obj));
    } catch (e) {
      setUserInfo(obj);
    }
  };

  console.log(userPayment);
  const uID = user["_id"];
  const performSearch = (searchValue) => {
    if (searchValue !== "") {
      const filteredItems = products.filter(
        (item) =>
          item.title.toLowerCase().includes(searchValue.toLowerCase()) ||
          (item.code &&
            item.code.toLowerCase().includes(searchValue.toLowerCase()) &&
            handleProductPress(item))
      );
      console.log(filteredItems);

      setFilteredProducts(filteredItems);
    } else {
      setFilteredProducts([]);
    }
  };
  const handleScanned = (data) => {
    setModalVisible(false);
    setScannedData(data); // Cập nhật giá trị quét
    performSearch(data); // Gọi hàm tìm kiếm với giá trị quét
  };
  const handleProductPress = (product) => {
    console.log(product);
    navigation.navigate("productdetail", { product: product });
  };

  const handleAddToCat = (product) => {
    addCartItem(product);
  };

  var headerOptions = {
    method: "GET",
    redirect: "follow",
  };

  const fetchProduct = () => {
    fetch(`${network.serverip}/products`, headerOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          setProducts(result.data);
          setError("");
          let payload = [];
          result.data.forEach((cat, index) => {
            let searchableItem = {
              ...cat,
              id: ++index,
              name: cat.title,
            };
            payload.push(searchableItem);
          });
          setSearchItems(payload);
        } else {
          setError(result.message);
        }
      })
      .catch((error) => {
        setError(error.message);
        console.log("error", error);
      });
  };

  const handleUpdatePayment = async () => {
    try {
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ payment: true }),
      };

      const response = await fetch(
        `${network.serverip}/update-user?id=${uID}`,
        requestOptions
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      if (data.success === true) {
        console.log("Cap nhat thanh cong", uID);
        setuserPayment(true);
        // Xử lý thành công, có thể làm gì đó ở đây (ví dụ: cập nhật giao diện, hiển thị thông báo, vv.)
      } else {
        Alert.alert("Error", data.message);
        // Xử lý lỗi, có thể hiển thị thông báo lỗi hoặc xử lý dữ liệu một cách phù hợp
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const testFetch = async () => {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts/1"
      );
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Fetch test error:", error);
    }
  };

  const handleOnRefresh = () => {
    setRefreshing(true);
    fetchProduct();
    setRefreshing(false);
  };
  useEffect(() => {
    convertToJSON(user);
    fetchProduct();
    setuserPayment(user["payment"]);
  }, []);
  useEffect(() => {
    if (autoSearch && scannedData !== "") {
      // Thực hiện tìm kiếm với dữ liệu đã quét
      // ...
      console.log("Performing search with:", scannedData);
      const filteredItems = products.filter(
        (item) =>
          (item.title &&
            item.title.toLowerCase().includes(searchValue.toLowerCase())) ||
          (item.code &&
            item.code.toLowerCase().indexOf(searchedText.toLowerCase()))
      );
      setFilteredProducts(filteredItems);

      // Đặt autoSearch thành false để ngăn việc tìm kiếm liên tục
      setAutoSearch(false);
    }
  }, [scannedData, autoSearch]);
  const [modalVisible, setModalVisible] = useState(false);
  const runFirst = `window.ReactNativeWebView.postMessage("True");`;
  const handleModal = () => {
    setShowModal(false);
  };
  function onMessage(data) {
    console.log("data webview", data.nativeEvent.data);
  }
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar></StatusBar>

      <View style={styles.topBarContainer}>
        <TouchableOpacity disabled>
          <Ionicons name="menu" size={30} color={colors.muted} />
        </TouchableOpacity>
        <View style={styles.topbarlogoContainer}>
          <Image source={easybuylogo} style={styles.logo} />
          <Text style={styles.toBarText}>FPOS</Text>
        </View>
        <TouchableOpacity
          style={styles.cartIconContainer}
          onPress={() => navigation.navigate("cart")}
        >
          {cartproduct.length > 0 ? (
            <View style={styles.cartItemCountContainer}>
              <Text style={styles.cartItemCountText}>{cartproduct.length}</Text>
            </View>
          ) : (
            <></>
          )}
          <Image source={cartIcon} />
        </TouchableOpacity>
      </View>
      {userPayment === true ? (
        <View style={styles.bodyContainer}>
          <View style={styles.searchContainer}>
            <View style={styles.inputContainer}>
              <SearchableDropdown
                onTextChange={(text) => {
                  setScannedData(text); // Cập nhật giá trị quét
                  performSearch(text); // Gọi hàm tìm kiếm khi giá trị quét thay đổi
                }}
                onItemSelect={(item) => handleProductPress(item)}
                defaultIndex={0}
                containerStyle={{
                  borderRadius: 5,
                  width: "100%",
                  elevation: 5,
                  position: "absolute",
                  zIndex: 20,
                  top: -3,
                  maxHeight: 300,
                  backgroundColor: colors.light,
                }}
                textInputStyle={{
                  borderRadius: 10,
                  padding: 6,
                  paddingLeft: 10,
                  borderWidth: 0,
                  backgroundColor: colors.white,
                }}
                itemStyle={{
                  padding: 10,
                  marginTop: 2,
                  backgroundColor: colors.white,
                  borderColor: colors.muted,
                }}
                itemTextStyle={{
                  color: colors.muted,
                }}
                itemsContainerStyle={{
                  maxHeight: "100%",
                }}
                items={searchItems}
                placeholder={scannedData !== "" ? scannedData : "Search..."}
                resetValue={false}
                underlineColorAndroid="transparent"
                defaultInputValue={scannedData !== "" ? scannedData : "Hello"} // Đặt giá trị quét vào ô tìm kiếm
              />
              {/* <CustomInput radius={5} placeholder={"Search...."} /> */}
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.scanButton}>
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={modalVisible}
                  onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                    setModalVisible(!modalVisible);
                  }}
                >
                  <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                      <BannerCodeScanner onScanned={handleScanned} />
                      <Pressable
                        style={styles.buttonClose}
                        onPress={() => setModalVisible(!modalVisible)}
                      >
                        <Text style={styles.textStyle}>Close</Text>
                      </Pressable>
                    </View>
                  </View>
                </Modal>
                <Pressable
                  style={[styles.button, styles.buttonOpen]}
                  onPress={() => setModalVisible(true)}
                >
                  <Text style={styles.textStyle}>Scan</Text>
                </Pressable>
              </TouchableOpacity>
            </View>
          </View>
          <ScrollView nestedScrollEnabled={true}>
            <View style={styles.promotiomSliderContainer}>
              <SliderBox
                images={slides}
                sliderBoxHeight={140}
                dotColor={colors.primary}
                inactiveDotColor={colors.muted}
                paginationBoxVerticalPadding={10}
                autoplayInterval={6000}
              />
            </View>
            <View style={styles.primaryTextContainer}>
              <Text style={styles.primaryText}>Categories</Text>
            </View>
            <View style={styles.categoryContainer}>
              <FlatList
                showsHorizontalScrollIndicator={false}
                style={styles.flatListContainer}
                horizontal={true}
                data={category}
                keyExtractor={(item, index) => `${item}-${index}`}
                renderItem={({ item, index }) => (
                  <View style={{ marginBottom: 10 }} key={index}>
                    <CustomIconButton
                      key={index}
                      text={item.title}
                      image={item.image}
                      onPress={() =>
                        navigation.jumpTo("categories", { categoryID: item })
                      }
                    />
                  </View>
                )}
              />
              <View style={styles.emptyView}></View>
            </View>
            <View style={styles.primaryTextContainer}>
              <Text style={styles.primaryText}>New Arrivals</Text>
            </View>
            {products.length === 0 ? (
              <View style={styles.productCardContainerEmpty}>
                <Text style={styles.productCardContainerEmptyText}>
                  No Product
                </Text>
              </View>
            ) : (
              <View style={styles.productCardContainer}>
                <FlatList
                  refreshControl={
                    <RefreshControl
                      refreshing={refeshing}
                      onRefresh={handleOnRefresh}
                    />
                  }
                  showsHorizontalScrollIndicator={false}
                  initialNumToRender={5}
                  horizontal={true}
                  data={products.slice(0, 4)}
                  keyExtractor={(item) => item._id}
                  renderItem={({ item, index }) => (
                    <View
                      key={item._id}
                      style={{
                        marginLeft: 5,
                        marginBottom: 10,
                        marginRight: 5,
                      }}
                    >
                      <ProductCard
                        name={item.title}
                        image={`${network.serverip}/uploads/${item.image}`}
                        price={item.price}
                        quantity={item.quantity}
                        onPress={() => handleProductPress(item)}
                        onPressSecondary={() => handleAddToCat(item)}
                      />
                    </View>
                  )}
                />
                <View style={styles.emptyView}></View>
              </View>
            )}
          </ScrollView>
        </View>
      ) : (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisiblee}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalVisiblee(!modalVisiblee);
          }}
        >
          <View
            image={require("../../assets/image/banners/banner.png")}
            style={[styles.centeredVieww]}
          >
            <View style={styles.modalVieww}>
              <Image
                source={require("../../assets/image/30days.png")}
                style={{ width: "100%", height: "94%" }}
              />
              <View>
                <Modal
                  visible={showModal}
                  onRequestClose={() => setShowModal(false)}
                >
                  <View>
                    <TouchableOpacity
                      style={{ marginTop: 40 }}
                      onPress={handleModal}
                    >
                      <Button onPress={() => setShowModal(false)} title="Close">
                        Close
                      </Button>
                    </TouchableOpacity>
                  </View>

                  <WebView
                    style={{ height: "90%" }}
                    source={{ uri: `${network.serverip}/paypal` }}
                    startInLoadingState={true}
                    scalesPageToFit={false}
                    mixedContentMode="compatibility"
                  />
                </Modal>
                <TouchableOpacity onPress={() => setShowModal(true)}>
                  <Button onPress={() => setShowModal(true)} title="Payment">
                    Paypal
                  </Button>
                  <Button
                    title="Update Payment"
                    onPress={handleUpdatePayment}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  centeredVieww: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalVieww: {
    backgroundColor: "white",
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    height: "80%",
    width: "80%",
  },
  buttonn: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpenn: {
    backgroundColor: "#F194FF",
  },
  buttonClosee: {
    backgroundColor: "#2196F3",
  },
  textStylee: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalTextt: {
    marginBottom: 15,
    textAlign: "center",
  },
  container: {
    width: "100%",
    flexDirecion: "row",
    backgroundColor: colors.light,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingBottom: 0,
    flex: 1,
  },
  topBarContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  toBarText: {
    fontSize: 15,
    fontWeight: "600",
  },
  topbarlogoContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 20,
  },
  bodyContainer: {
    width: "100%",
    flexDirecion: "row",

    paddingBottom: 0,
    flex: 1,
  },
  logoContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  logo: {
    height: 30,
    width: 30,
    resizeMode: "contain",
  },
  secondaryText: {
    fontSize: 25,
    fontWeight: "bold",
  },
  searchContainer: {
    padding: 10,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 2,
  },
  inputContainer: {
    width: "70%",
    height: "35%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    width: "20%",
    justifyContent: "center",
    alignItems: "center",
  },
  scanButton: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: 10,
    height: 40,
    width: "100%",
  },
  scanButtonText: {
    fontSize: 15,
    color: colors.light,
    fontWeight: "bold",
  },
  primaryTextContainer: {
    padding: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
    paddingTop: 10,
    paddingBottom: 10,
  },
  primaryText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  flatListContainer: {
    width: "100%",
    height: 50,
    marginTop: 10,
    marginLeft: 10,
  },
  promotiomSliderContainer: {
    margin: 5,
    height: 140,
    backgroundColor: colors.light,
  },
  categoryContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    height: 60,
    marginLeft: 10,
  },
  emptyView: { width: 30 },
  productCardContainer: {
    paddingLeft: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    height: 240,
    marginLeft: 10,
    paddingTop: 0,
  },
  productCardContainerEmpty: {
    padding: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 240,
    marginLeft: 10,
    paddingTop: 0,
  },
  productCardContainerEmptyText: {
    fontSize: 15,
    fontStyle: "italic",
    color: colors.muted,
    fontWeight: "600",
  },
  cartIconContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  cartItemCountContainer: {
    position: "absolute",
    zIndex: 10,
    top: -10,
    left: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 22,
    width: 22,
    backgroundColor: colors.danger,
    borderRadius: 11,
  },
  cartItemCountText: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    height: "70%",
    width: "90%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: "#2196F3",
    borderRadius: 20,
    padding: 10,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
