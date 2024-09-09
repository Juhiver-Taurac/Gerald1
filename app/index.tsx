import React, { useState, useRef } from "react";
import { Text, View, Image, Animated } from "react-native";
import { Formik, FormikHelpers } from "formik";
import styles from "./Styles/GlobalStyles";
import { validationSchema } from "./yup/validationSchema";
import Button from "@/components/globalcomponents/Button";
import FormFields from "@/components/globalcomponents/FormField";
import { TouchableOpacity } from "react-native-gesture-handler";
import NotificationModal from "@/components/globalcomponents/NotificationModal";

interface FormValues {
  firstN: string;
  lastN: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegistrationForm: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState(false);

  const scaleValue = useRef(new Animated.Value(0)).current;

  const handleRegister = (
    values: FormValues,
    actions: FormikHelpers<FormValues>
  ) => {
    console.log(JSON.stringify(values));

    setModalMessage("Registration successful!");
    setIsSuccess(true);
    setModalVisible(true);

    Animated.timing(scaleValue, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    actions.resetForm();

    setTimeout(() => {
      Animated.timing(scaleValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setModalVisible(false));
    }, 2000);
  };

  const handleValidationError = (errors: any, values: FormValues) => {
    const areFieldsEmpty = Object.values(values).some((value) => value === "");

    if (areFieldsEmpty) {
      setModalMessage("Please fill all the fields.");
    } else if (Object.keys(errors).length > 0) {
      const firstError = Object.values(errors)[0] as string;
      setModalMessage(firstError);
    } else {
      setModalMessage("Please check the fields and try again.");
    }

    setIsSuccess(false);
    setModalVisible(true);

    Animated.timing(scaleValue, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      Animated.timing(scaleValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setModalVisible(false));
    }, 2000);
  };

  return (
    <Formik
      initialValues={{
        firstN: "",
        lastN: "",
        email: "",
        password: "",
        confirmPassword: "",
      }}
      validationSchema={validationSchema}
      onSubmit={handleRegister}
      validateOnChange={true}
      validateOnBlur={false}
    >
      {({ validateForm, handleSubmit, values, errors, touched }) => (
        <View style={styles.container}>
          <View style={styles.formContainer}>
            <Image
              source={require("../assets/images/registration.png")}
              style={styles.image}
            />
            <Text style={styles.heading} >REGISTER HERE!</Text>
            <FormFields touched={touched} errors={errors} />
            <Button
              title="Register"
              onPress={() => {
                validateForm().then((errors) => {
                  if (Object.keys(errors).length > 0) {
                    handleValidationError(errors, values);
                  } else {
                    handleSubmit();
                  }
                });
              }}
            />
          </View>

          <NotificationModal
            visible={modalVisible}
            message={modalMessage}
            isSuccess={isSuccess}
            onClose={() => setModalVisible(false)}
            scaleValue={scaleValue}
          />
        </View>
      )}
    </Formik>
  );
};

export default RegistrationForm;
