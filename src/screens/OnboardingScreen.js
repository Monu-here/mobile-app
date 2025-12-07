import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Animated,
} from 'react-native';

const { width } = Dimensions.get('window');

const slides = [
  {
    key: '1',
    title: 'Welcome to SchoolApp',
    subtitle: 'Simplify School Management',
    text: 'Manage classes, attendance, and communicate with parents all in one place.',
    icon: '🏫',
    color: '#6C63FF',
    lightColor: '#E8E4F8',
    features: ['Classes', 'Attendance', 'Communication'],
  },
  {
    key: '2',
    title: 'Track Progress',
    subtitle: 'Monitor Student Performance',
    text: 'Real-time insights into student performance and automated report generation.',
    icon: '📊',
    color: '#00BFA6',
    lightColor: '#E0F7F4',
    features: ['Analytics', 'Reports', 'Insights'],
  },
  {
    key: '3',
    title: 'Stay Connected',
    subtitle: 'Seamless Communication',
    text: 'Send announcements, chat with parents and staff, and stay updated.',
    icon: '💬',
    color: '#FF6B6B',
    lightColor: '#FFE8E8',
    features: ['Messaging', 'Announcements', 'Notifications'],
  },
  {
    key: '4',
    title: 'All Set!',
    subtitle: 'Ready to Begin',
    text: "You're all set to manage your school efficiently. Let's get started!",
    icon: '🚀',
    color: '#FFA41B',
    lightColor: '#FFF4E8',
    features: ['Ready', 'Excited', 'Go'],
  }
];

export default function OnboardingScreen({ onDone }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const onNext = () => {
    if (currentIndex < slides.length - 1) {
      flatRef.current.scrollToIndex({ index: currentIndex + 1, animated: true });
    } else {
      onDone && onDone();
    }
  };

  const onSkip = () => {
    onDone && onDone();
  };

  const renderItem = ({ item }) => (
    <View style={[styles.slide, { backgroundColor: item.color, width }]}>
      <View style={[styles.gradientAccent, { backgroundColor: item.lightColor }]} />
      
      <View style={styles.slideContent}>
        <View style={[styles.iconContainer, { backgroundColor: item.lightColor }]}>
          <Text style={styles.icon}>{item.icon}</Text>
        </View>

        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.subtitle}</Text>
        <Text style={styles.description}>{item.text}</Text>

        <View style={styles.featuresContainer}>
          {item.features.map((feature, idx) => (
            <View key={idx} style={styles.featureTag}>
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>SchoolApp</Text>
        {currentIndex < slides.length - 1 && (
          <TouchableOpacity onPress={onSkip} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
        ref={flatRef}
        onViewableItemsChanged={onViewableItemsChanged}
        scrollEventThrottle={32}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })}
      />

      <View style={styles.footer}>
        <View style={styles.dotsContainer}>
          {slides.map((_, i) => (
            <Animated.View
              key={i}
              style={[
                styles.dot,
                i === currentIndex && styles.activeDot,
              ]}
            />
          ))}
        </View>

        <View style={styles.buttonContainer}>
          {currentIndex > 0 && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => flatRef.current.scrollToIndex({ index: currentIndex - 1, animated: true })}
            >
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.nextButton, { backgroundColor: slides[currentIndex].color }]}
            onPress={onNext}
          >
            <Text style={styles.nextButtonText}>
              {currentIndex === slides.length - 1 ? 'Get Started' : 'Next →'}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.slideCounter}>
          {currentIndex + 1} / {slides.length}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A1A1A',
    letterSpacing: 0.5,
  },
  skipText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#999',
  },
  slide: {
    flex: 1,
    width,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 40,
    overflow: 'hidden',
  },
  gradientAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '30%',
    opacity: 0.4,
  },
  slideContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  icon: {
    fontSize: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 0.2,
  },
  description: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
    fontWeight: '400',
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  featureTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 4,
    marginBottom: 8,
  },
  featureText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  footer: {
    paddingBottom: 24,
    paddingHorizontal: 20,
    paddingTop: 16,
    backgroundColor: '#FAFAFA',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#DDD',
  },
  activeDot: {
    backgroundColor: '#1A1A1A',
    width: 24,
    borderRadius: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  backButton: {
    flex: 0.3,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#DDD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    color: '#1A1A1A',
    fontWeight: '600',
    fontSize: 14,
  },
  nextButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  nextButtonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.3,
  },
  slideCounter: {
    textAlign: 'center',
    color: '#999',
    fontSize: 13,
    fontWeight: '500',
  },
});
