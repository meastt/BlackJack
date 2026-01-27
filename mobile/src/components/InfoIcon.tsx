import React, { useState } from 'react';
import { TouchableOpacity, Modal, View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../theme/colors';
import { LocalTips, Tip } from '../utils/LocalTips';
import * as Haptics from 'expo-haptics';

interface InfoIconProps {
  tipKey: string;
  size?: number;
  color?: string;
}

export const InfoIcon: React.FC<InfoIconProps> = ({ tipKey, size = 20, color = colors.accentBlue }) => {
  const [showModal, setShowModal] = useState(false);
  const tip = LocalTips.getTip(tipKey);

  if (!tip) {
    return null; // Don't render if tip doesn't exist
  }

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowModal(true);
  };

  const handleClose = () => {
    Haptics.selectionAsync();
    setShowModal(false);
  };

  return (
    <>
      <TouchableOpacity
        onPress={handlePress}
        style={[styles.iconContainer, { width: size, height: size }]}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text style={[styles.icon, { fontSize: size, color }]}>ⓘ</Text>
      </TouchableOpacity>

      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={handleClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{tip.title}</Text>
              <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.modalBody}
              contentContainerStyle={styles.modalBodyContent}
              showsVerticalScrollIndicator={true}
            >
              <Text style={styles.modalText}>{tip.content}</Text>
            </ScrollView>

            <TouchableOpacity style={styles.gotItButton} onPress={handleClose}>
              <Text style={styles.gotItButtonText}>Got it!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    width: '100%',
    maxWidth: 500,
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.glassBorder,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.textPrimary,
    flex: 1,
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: colors.surfaceLight,
  },
  closeButtonText: {
    fontSize: 20,
    color: colors.textSecondary,
    fontWeight: 'bold',
  },
  modalBody: {
    maxHeight: '100%',
  },
  modalBodyContent: {
    padding: 20,
    paddingBottom: 10,
  },
  modalText: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.textPrimary,
  },
  gotItButton: {
    backgroundColor: colors.accentBlue,
    margin: 20,
    marginTop: 10,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: colors.accentBlue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  gotItButtonText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
