import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import EmptyState from '../components/EmptyState';
import LoadingButton from '../components/LoadingButton';
import ProjectCard from '../components/ProjectCard';
import { palettes } from '../constants/colors';
import { logout } from '../store/slices/authSlice';
import { createProject, deleteProject, fetchProjects } from '../store/slices/projectsSlice';
import { toggleTheme } from '../store/slices/themeSlice';

export default function ProjectsScreen({ navigation }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { items, loading, saving, error } = useSelector((state) => state.projects);
  const mode = useSelector((state) => state.theme.mode);
  const colors = palettes[mode];
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const submitProject = async () => {
    if (!title.trim()) return;
    const result = await dispatch(createProject({ title: title.trim(), description: description.trim() }));
    if (!result.error) {
      setTitle('');
      setDescription('');
    }
  };

  const inputStyle = {
    backgroundColor: colors.input,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    color: colors.text,
    fontSize: 15,
    marginBottom: 10,
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ padding: 20, flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <View>
            <Text style={{ color: colors.muted, fontWeight: '700' }}>Hello {user?.name || 'there'}</Text>
            <Text style={{ color: colors.text, fontSize: 32, fontWeight: '900' }}>Your projects</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <Pressable onPress={() => dispatch(toggleTheme())}>
              <Text style={{ color: colors.primary, fontWeight: '900' }}>{mode === 'light' ? 'Dark' : 'Light'}</Text>
            </Pressable>
            <Pressable onPress={() => dispatch(logout())}>
              <Text style={{ color: colors.danger, fontWeight: '900' }}>Logout</Text>
            </Pressable>
          </View>
        </View>

        <View style={{ backgroundColor: colors.card, borderRadius: 24, padding: 16, borderColor: colors.border, borderWidth: 1, marginBottom: 18 }}>
          <Text style={{ color: colors.text, fontSize: 18, fontWeight: '900', marginBottom: 12 }}>Create project</Text>
          <TextInput placeholder="Project title" placeholderTextColor={colors.muted} value={title} onChangeText={setTitle} style={inputStyle} />
          <TextInput
            placeholder="Short description"
            placeholderTextColor={colors.muted}
            value={description}
            onChangeText={setDescription}
            style={[inputStyle, { minHeight: 76, textAlignVertical: 'top' }]}
            multiline
          />
          <LoadingButton title="Add Project" loading={saving} onPress={submitProject} colors={colors} />
        </View>

        {loading ? (
          <ActivityIndicator color={colors.primary} style={{ marginTop: 30 }} />
        ) : (
          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={<EmptyState colors={colors} title="No projects yet" subtitle="Create your first project and tasks will start feeling less slippery." />}
            renderItem={({ item }) => (
              <ProjectCard
                project={item}
                colors={colors}
                onPress={() => navigation.navigate('ProjectDetail', { project: item })}
                onDelete={() => dispatch(deleteProject(item.id))}
              />
            )}
          />
        )}

        {!!error && <Text style={{ color: colors.danger, marginTop: 8 }}>{error}</Text>}
      </View>
    </SafeAreaView>
  );
}
