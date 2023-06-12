import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Button,
  TouchableOpacity,
  Pressable,
  Alert,
} from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import {
  Box,
  Center,
  FlatList,
  FormControl,
  HStack,
  IconButton,
  Image,
  Input,
  Modal,
  PresenceTransition,
  useToast,
  VStack,
} from "native-base";
import { useDispatch, useSelector } from "react-redux";

export default function BannerCodeScanner({ onScanned }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [searchText, setSearchText] = useState("Not yet scanned");
  const [showModal, setShowModal] = useState(true);
  const [open, setOpen] = useState(true);
  const [modalVisible, setModalVisible] = useState(true);
  const dispatch = useDispatch();

  const [data, setData] = useState([]);
  const handleSearch = (text) => {
    setSearchText(text);
    // Filter the data based on the search text
    const filteredData = products.filter((item) => {
      const lowerCaseText = text.toLowerCase();
      const lowerCaseName = item.name.toLowerCase();

      // Kiểm tra dữ liệu kiểu chuỗi
      if (
        typeof item.name === "string" &&
        lowerCaseName.includes(lowerCaseText)
      ) {
        return true;
      }

      // Kiểm tra dữ liệu kiểu số
      if (typeof item.code === "string" && item.code.includes(lowerCaseText)) {
        return true;
      }

      // Không tìm thấy phù hợp
      return false;
    });
    setData(filteredData);
    console.log(data);
  };
  const renderItem = ({ item }) => (
    <Box>
      <TouchableOpacity>
        <Center shadow={4}>
          <Pressable
            onPress={() => {
              // update selected product
              dispatch(productsSlice.actions.setSelectedProduct(item.id));

              navigation.navigate("Product Details");
            }}
          >
            <Image
              source={{ uri: item.image }}
              alt={item.name}
              style={{ width: 50, height: 50 }}
            />
            <Text>{item.name}</Text>
          </Pressable>
        </Center>
      </TouchableOpacity>
    </Box>
  );
  const toast = useToast();
  const ToastDetails = [
    {
      title: "Account verified",
      variant: "solid",
      description: "Thanks for signing up with us.",
      isClosable: true,
    },
    {
      title: "Something went wrong",
      variant: "subtle",
      description: "Please create a support ticket from the support page",
    },
    {
      title: "Network connection restored",
      variant: "left-accent",
      description:
        "This is to inform you that your network connectivity is restored",
      isClosable: true,
    },
    {
      title: "Invalid email address",
      variant: "top-accent",
      description: "Please enter a valid email address",
    },
    {
      title: "Invalid email address",
      variant: "outline",
      description: "Please enter a valid email address",
    },
  ];

  const ToastAlert = ({
    id,
    status,
    variant,
    title,
    description,
    isClosable,
    ...rest
  }) => (
    <Alert
      maxWidth="100%"
      alignSelf="center"
      flexDirection="row"
      status={status ? status : "info"}
      variant={variant}
      {...rest}
    >
      <VStack space={1} flexShrink={1} w="100%">
        <HStack
          flexShrink={1}
          alignItems="center"
          justifyContent="space-between"
        >
          <HStack space={2} flexShrink={1} alignItems="center">
            <Alert.Icon />
            <Text
              fontSize="md"
              fontWeight="medium"
              flexShrink={1}
              color={
                variant === "solid"
                  ? "lightText"
                  : variant !== "outline"
                  ? "darkText"
                  : null
              }
            >
              {title}
            </Text>
          </HStack>
          {isClosable ? (
            <IconButton
              variant="unstyled"
              icon={<CloseIcon size="3" />}
              _icon={{
                color: variant === "solid" ? "lightText" : "darkText",
              }}
              onPress={() => toast.close(id)}
            />
          ) : null}
        </HStack>
        <Text
          px="6"
          color={
            variant === "solid"
              ? "lightText"
              : variant !== "outline"
              ? "darkText"
              : null
          }
        >
          {description}
        </Text>
      </VStack>
    </Alert>
  );
  const [isOpen, setIsOpen] = useState(false);

  const askForCameraPermission = () => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  };

  // Request Camera Permission
  useEffect(() => {
    askForCameraPermission();
  }, []);

  // What happens when we scan the bar code
  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setIsOpen(true);
    setSearchText(data);
    setModalVisible(false);
    console.log("Type: " + type + "\nData: " + data);

    // Gọi callback để thông báo quét thành công và đóng Modal
    onScanned(data);
    console.log("Type: " + type + "\nData: " + data);
  };

  // Check permissions and return the screens
  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Requesting for camera permission</Text>
      </View>
    );
  }
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={{ margin: 10 }}>No access to camera</Text>
        <Button
          title={"Allow Camera"}
          onPress={() => askForCameraPermission()}
        />
      </View>
    );
  }

  // Return the View
  return (
    <View>
      <View style={styles.barcodebox}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={{ height: "100%", width: 320 }}
        />
      </View>

      {scanned && (
        <View>
          <Text>{data}</Text>
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  maintext: {
    fontSize: 16,
    margin: 20,
  },
  barcodebox: {
    height: "100%",
    width: "100%",
    overflow: "hidden",
    borderRadius: 30,
  },
});
