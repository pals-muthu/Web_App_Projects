import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const IconButton = ({ icon, size, color, onPress }) => {
	return (
		<Pressable onPress={onPress} style={({ pressed }) => pressed && styles.pressed}>
			<View style={styles.container}>
				<Ionicons name={icon} size={size} color={color} />
			</View>
		</Pressable>
	);
};

export default IconButton;

const styles = StyleSheet.create({
	pressed: {
		opacity: 0.75,
	},
	container: {
		marginHorizontal: 16,
		marginVertical: 2,
		borderRadius: 24,
	},
});
