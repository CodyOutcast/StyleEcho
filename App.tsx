import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import type { ComponentRef } from 'react';
import { BackHandler, Pressable, ScrollView, Text, View } from 'react-native';
import type { ImageSourcePropType } from 'react-native';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { buildProfile, matchOutfit } from './src/model';
import type { Category, Inspiration, Piece } from './src/model';
import { TaskProgress, tasks } from './src/motion';
import type { Task } from './src/motion';
import { Closet, Library, Outfits, Primary, StyleProfile } from './src/screens';
import {
  initialLooks,
  initialPieces,
  initialSelectedLookIds,
  outfitTemplates,
  sampleLook,
  samplePiece,
  styleTemplates,
} from './src/sample-data';
import { LookLinkForm, MatchReasons, PieceDetails, Sheet, StyleCues } from './src/sheets';
import { colors, styles } from './src/theme';

const tabs = [
  { id: 'library', label: 'Library', icon: 'albums-outline' },
  { id: 'profile', label: 'Profile', icon: 'finger-print-outline' },
  { id: 'closet', label: 'Closet', icon: 'shirt-outline' },
  { id: 'outfits', label: 'Outfits', icon: 'sparkles-outline' },
] as const;

type Tab = (typeof tabs)[number]['id'];
type SheetState =
  | { type: 'link' | 'cues' | 'match' | 'reset' }
  | { type: 'piece'; piece: Piece }
  | { type: 'progress'; task: Task; media: ImageSourcePropType[]; complete: () => void };

type StyleSession = {
  selectedLookIds: string[];
  savedLook: Inspiration | null;
  addedPiece: Piece | null;
  prefersCasual: boolean;
};

const initialSession: StyleSession = {
  selectedLookIds: initialSelectedLookIds,
  savedLook: null,
  addedPiece: null,
  prefersCasual: false,
};

function StyleWorkspace() {
  const { bottom } = useSafeAreaInsets();
  const [session, setSession] = useState(initialSession);
  const [tab, setTab] = useState<Tab>('library');
  const [sheet, setSheet] = useState<SheetState | null>(null);
  const [filter, setFilter] = useState<'All' | Category>('All');
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  const looks = session.savedLook ? [...initialLooks, session.savedLook] : initialLooks;
  const closet = session.addedPiece ? [session.addedPiece, ...initialPieces] : initialPieces;
  const selected = looks.filter(look => session.selectedLookIds.includes(look.id));
  const originalProfile = buildProfile(selected, styleTemplates);
  const casualProfile = buildProfile(selected, styleTemplates, 'Casual');
  const originalOutfit = originalProfile ? matchOutfit(originalProfile, closet, outfitTemplates) : undefined;
  const casualOutfit =
    originalOutfit && casualProfile
      ? matchOutfit(casualProfile, closet, outfitTemplates, originalOutfit.id)
      : undefined;
  const casualApplied = session.prefersCasual && Boolean(casualOutfit);
  const profile = casualApplied ? casualProfile : originalProfile;
  const outfit = casualApplied ? casualOutfit : originalOutfit;
  const casualAction =
    originalOutfit?.traits.formality === 'Casual' ? 'Try another casual outfit' : 'Make it more casual';

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (tab === 'library') return false;
      setTab('library');
      return true;
    });
    return () => subscription.remove();
  }, [tab]);

  function goTo(next: Tab) {
    if (next === 'closet' && tab !== 'closet') setFilter('All');
    if (next === tab) scroll.current?.scrollTo({ y: 0, animated: true });
    setTab(next);
  }

  function toggleLook(id: string) {
    setSession(current => ({
      ...current,
      selectedLookIds: current.selectedLookIds.includes(id)
        ? current.selectedLookIds.filter(selectedId => selectedId !== id)
        : [...current.selectedLookIds, id],
    }));
  }

  function run(task: Task, media: ImageSourcePropType[], apply: () => void) {
    setSheet({
      type: 'progress',
      task,
      media,
      complete: () => {
        apply();
        setSheet(null);
      },
    });
  }

  function addLook(source: URL) {
    run('importLook', [sampleLook.image], () => {
      setSession(current =>
        current.savedLook
          ? current
          : {
              ...current,
              savedLook: { ...sampleLook, source },
              selectedLookIds: [...current.selectedLookIds, sampleLook.id],
            },
      );
      scroll.current?.scrollTo({ y: 0 });
    });
  }

  function addPiece() {
    run('addPiece', [samplePiece.image], () => {
      setSession(current => (current.addedPiece ? current : { ...current, addedPiece: samplePiece }));
      setFilter('All');
      scroll.current?.scrollTo({ y: 0 });
    });
  }

  function buildStyleProfile() {
    run(
      'buildProfile',
      selected.slice(0, 3).map(look => look.image),
      () => goTo('profile'),
    );
  }

  function generateOutfit() {
    if (!profile) {
      goTo('library');
      return;
    }
    run(
      'generateOutfit',
      closet.slice(0, 3).map(piece => piece.image),
      () => goTo('outfits'),
    );
  }

  function togglePreference() {
    if (!outfit) return;
    run(
      'updateOutfit',
      outfit.pieces.slice(0, 3).map(piece => piece.image),
      () => {
        setSession(current => ({ ...current, prefersCasual: !current.prefersCasual }));
        scroll.current?.scrollTo({ y: 0 });
      },
    );
  }

  function resetSession() {
    setSession(initialSession);
    goTo('library');
    setSheet(null);
  }

  const action = (() => {
    switch (tab) {
      case 'library':
        return (
          <Primary title="Build my style profile" disabled={!selected.length} onPress={buildStyleProfile} />
        );
      case 'profile':
        return (
          profile && <Primary title="See my closet" icon="shirt-outline" onPress={() => goTo('closet')} />
        );
      case 'closet':
        return (
          <Primary
            title={profile ? 'Generate outfits' : 'Choose inspiration'}
            icon="sparkles-outline"
            onPress={generateOutfit}
          />
        );
      case 'outfits':
        return (
          casualOutfit && (
            <Primary
              title={casualApplied ? 'Restore original match' : casualAction}
              icon={casualApplied ? 'refresh-outline' : 'swap-horizontal'}
              onPress={togglePreference}
            />
          )
        );
    }
  })();

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" />
      <View style={styles.frame}>
        <View style={styles.header}>
          <View style={styles.brandGroup} accessibilityLabel="STYLEECHO">
            <View style={styles.brandMark}>
              <Ionicons aria-hidden name="sparkles" size={16} color={colors.white} />
            </View>
            <Text style={styles.brand}>STYLEECHO</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Session options"
            style={styles.iconButton}
            onPress={() => setSheet({ type: 'reset' })}
          >
            <Ionicons aria-hidden name="ellipsis-horizontal" size={20} color={colors.wine} />
          </Pressable>
        </View>
        <ScrollView
          key={tab}
          ref={scroll}
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {tab === 'library' && (
            <Library
              looks={looks}
              selectedIds={session.selectedLookIds}
              canAddLook={!session.savedLook}
              toggle={toggleLook}
              add={() => setSheet({ type: 'link' })}
              showCues={() => setSheet({ type: 'cues' })}
            />
          )}
          {tab === 'profile' && (
            <StyleProfile selected={selected} profile={profile} edit={() => goTo('library')} />
          )}
          {tab === 'closet' && (
            <Closet
              pieces={closet}
              filter={filter}
              setFilter={setFilter}
              addedPieceId={session.addedPiece?.id}
              add={addPiece}
              showPiece={piece => setSheet({ type: 'piece', piece })}
            />
          )}
          {tab === 'outfits' && (
            <Outfits
              outfit={outfit}
              prefersCasual={casualApplied}
              edit={() => goTo('library')}
              showReasons={() => setSheet({ type: 'match' })}
              openPiece={piece => setSheet({ type: 'piece', piece })}
            />
          )}
        </ScrollView>
        {action && <View style={styles.actionBar}>{action}</View>}
        <View accessibilityRole="tablist" style={[styles.tabs, { paddingBottom: Math.max(bottom, 5) }]}>
          {tabs.map(item => (
            <Pressable
              key={item.id}
              accessibilityRole="tab"
              aria-selected={tab === item.id}
              style={styles.tab}
              onPress={() => goTo(item.id)}
            >
              <View style={[styles.tabIcon, tab === item.id && styles.tabIconActive]}>
                <Ionicons
                  aria-hidden
                  name={item.icon}
                  size={19}
                  color={tab === item.id ? colors.wine : colors.muted}
                />
              </View>
              <Text style={[styles.tabLabel, tab === item.id && styles.tabActive]}>{item.label}</Text>
            </Pressable>
          ))}
        </View>
      </View>
      {sheet && (
        <Sheet
          title={
            sheet.type === 'piece'
              ? sheet.piece.name
              : sheet.type === 'progress'
                ? tasks[sheet.task].title
                : {
                    link: 'Add an outfit link',
                    cues: 'The four style cues',
                    match: 'Why it matches',
                    reset: 'Session options',
                  }[sheet.type]
          }
          bottom={bottom}
          close={() => setSheet(null)}
        >
          {sheet.type === 'link' && <LookLinkForm submit={addLook} />}
          {sheet.type === 'progress' && (
            <TaskProgress key={sheet.task} task={sheet.task} media={sheet.media} complete={sheet.complete} />
          )}
          {sheet.type === 'cues' && <StyleCues />}
          {sheet.type === 'match' && outfit && <MatchReasons outfit={outfit} />}
          {sheet.type === 'piece' && <PieceDetails piece={sheet.piece} />}
          {sheet.type === 'reset' && (
            <>
              <Text style={styles.body}>Restore the initial style library, closet, and preferences.</Text>
              <Primary icon="refresh-outline" title="Reset session" onPress={resetSession} />
            </>
          )}
        </Sheet>
      )}
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StyleWorkspace />
    </SafeAreaProvider>
  );
}
